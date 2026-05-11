# Fullshot — Fresh Redeployment Guide

This guide walks you through **completely tearing down** the existing Azure deployment and starting fresh from `deploy.azcli`. Follow the steps in order.

---

## Part 1: Delete Existing Resources

You have two options: Azure Portal (GUI) or Azure CLI (faster). **Choose one.**

---

### Option A: Delete via Azure Portal

1. Open [portal.azure.com](https://portal.azure.com) and sign in.
2. In the search bar at the top, type **Resource Groups** and select it.
3. Click on **`rg-fullshot-project`**.
4. Click **Delete resource group** at the top of the page.
5. In the confirmation dialog, type `rg-fullshot-project` exactly and click **Delete**.

> ⚠️ This deletes **everything** inside the resource group: App Service, PostgreSQL, Key Vault, Application Insights, and the App Service Plan. It may take 2–5 minutes.

---

### Option B: Delete via Azure CLI (Recommended — Faster)

Run the following from your terminal:

```bash
az group delete --name rg-fullshot-project --yes --no-wait
```

- `--yes` skips the confirmation prompt.
- `--no-wait` returns immediately; the deletion continues in the background.

To **check if deletion is complete** before redeploying:
```bash
az group show --name rg-fullshot-project --query "properties.provisioningState" -o tsv
```
Wait until this command returns `ResourceGroupNotFound` (or an error), which means deletion is complete.

---

## Part 2: Handle the Key Vault Soft-Delete

> ⚠️ **This step is critical.** Azure Key Vault has a **soft-delete protection** feature that keeps deleted vaults recoverable for 90 days. If you skip this, redeployment will fail with: `A vault with the same name already exists in deleted state`.

After the resource group is deleted, **purge the soft-deleted Key Vault**:

```bash
# List soft-deleted Key Vaults to find the name
az keyvault list-deleted --query "[].name" -o tsv

# Purge it (replace <vault-name> with the output above)
az keyvault purge --name <vault-name> --location eastasia
```

This permanently removes the vault so Bicep can recreate it with the same name.

---

## Part 3: Redeploy from Scratch

Once the resource group is confirmed deleted and the Key Vault is purged:

### 1. Ensure your `.env` file has the correct password

Open `.env` in the project root and confirm `DB_PASSWORD` is set:
```
DB_PASSWORD=markjorias#1#2#3#4
```

### 2. Log in to Azure (if your session has expired)
```bash
az login
```

### 3. Navigate to the deployment folder and run the script
```bash
cd deployment
bash deploy.azcli
```

This will:
- Create the `rg-fullshot-project` resource group in `eastasia`
- Deploy all Bicep resources: App Service, PostgreSQL, Key Vault, Application Insights
- Output the App Service URL on success

> ⏱ Bicep deployment typically takes **5–8 minutes** to complete.

---

## Part 4: Post-Deployment Steps

### 4a. Connect GitHub CI/CD (Deployment Center)

1. In the **Azure Portal**, go to your new **App Service**.
2. Left sidebar → **Deployment Center**.
3. Set **Source** to **GitHub**, authorize, and select:
   - Repository: `HCI-FINALS-PROJECT`
   - Branch: `main`
4. Click **Save**. This triggers the first automated deploy.

### 4b. Wait for RBAC to Propagate

The Bicep grants the App Service Managed Identity the **Key Vault Secrets User** role automatically. However, **Azure RBAC can take 5–10 minutes to propagate**.

To verify the Key Vault reference is resolving:
1. Go to your App Service → **Environment Variables** (under Settings).
2. Check `DB_PASS` — if it shows `•••••••` (masked), the secret resolved. ✅
3. If it still shows `@Microsoft.KeyVault(...)`, wait a few minutes and **restart** the App Service.

### 4c. Initialize the Database

Once GitHub Actions has finished deploying your code (green checkmark in the Actions tab), open the **SSH terminal** in the Azure Portal:

1. App Service → **Development Tools** → **SSH** → Click **Go →**
2. Run:
   ```bash
   cd site/wwwroot
   node db/init_db.js
   ```
   The script auto-resolves the Key Vault secret using Managed Identity — no manual password needed.

   Expected output:
   ```
   Detected Key Vault reference — resolving via Managed Identity...
   Key Vault secret resolved successfully.
   Connecting to database...
   Initializing Database...
   Successfully executed schema_menu.sql
   Successfully executed schema_users.sql
   Successfully executed schema_orders.sql
   Successfully executed schema_feedback.sql
   Migrating data from coffee_shop.db...
   Successfully executed seed_data.sql
   Done.
   ```

### 4d. Verify the Live Site

Your deployed site will be at:
```
https://<app-service-name>.azurewebsites.net
```

Test accounts from `seed_data.sql`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@halfshot.com` | `adminpassword123` |
| User | `test@example.com` | `testpassword123` |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `A vault with the same name already exists` | Run `az keyvault purge --name <vault-name> --location eastasia` |
| `DB_PASS` not resolving (shows raw reference) | Wait 5–10 min for RBAC propagation, then restart the App Service |
| `node db/init_db.js` fails with `IMDS error` | RBAC hasn't propagated yet — wait and retry, or pass `DB_PASS='...' node db/init_db.js` as a temporary override |
| GitHub Actions fails | Check the workflow run in the **Actions** tab of your GitHub repo |
| Site shows 503 / container timeout | Check **Log Stream** in the App Service for startup errors |
