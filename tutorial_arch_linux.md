# Azure Cloud Configuration Tutorial (Arch Linux)

This tutorial will guide you through exactly what you need to configure in the Azure Portal to complete the setup of your E-Commerce Storefront architecture, and how to transition away from your old VM.

## Step 1: Install the Azure CLI

The Azure CLI (`az`) is a tool that allows your terminal to communicate directly with your Azure account. 

1. Open your terminal.
2. Run the following command to install it via pacman on Arch Linux:
   ```bash
   sudo pacman -S azure-cli
   ```
3. Verify the installation by running:
   ```bash
   az --version
   ```

## Step 2: Deploying the Bicep Infrastructure

Instead of configuring everything manually by clicking through the Azure Portal (which takes hours and is prone to errors), you can deploy your entire architecture automatically using the scripts we provided.

1. In your terminal, ensure you are in the project directory.
2. Run the Azure CLI login command:
   ```bash
   az login
   ```
   *This will open a browser window for you to sign in with your Azure for Students account.*
3. Navigate to the deployment folder:
   ```bash
   cd deployment
   ```
4. Open `deploy.azcli` in your editor, change the `DB_PASSWORD` variable to a secure password, and save.
5. Execute the script:
   ```bash
   bash deploy.azcli
   ```
   *This will automatically create your App Service, PostgreSQL Database, Key Vault, and Application Insights.*

## Step 3: Verify Key Vault Access (Managed Identity)

Your `main.bicep` uses a **Key Vault Reference** to securely inject the database password into the App Service at runtime — no password ever touches your code or GitHub repository.

```bicep
// In main.bicep — the App Service reads this secret automatically at startup
name: 'DB_PASS'
value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=${dbPasswordSecret.name})'
```

This works through a chain of Azure services:
1. The App Service has a **System-Assigned Managed Identity** (created automatically by the Bicep `identity: { type: 'SystemAssigned' }` block).
2. The Bicep grants that identity the **Key Vault Secrets User** RBAC role on the Key Vault.
3. At startup, Azure resolves the `@Microsoft.KeyVault(...)` string and injects the real password as `DB_PASS`.

> **⚠️ Known Issue — RBAC Propagation Delay:** Azure RBAC role assignments can take **5–10 minutes** to propagate. If your app starts before this window, it will fail to read the secret and crash.

### How to verify it is working

1. In the **Azure Portal**, go to your **App Service → Environment Variables** (under Settings).
2. Click on `DB_PASS`. If the value shows as `@Microsoft.KeyVault(...)`, the reference is **not yet resolved** — wait and restart the App Service.
3. If the value is hidden/masked (shows `•••••••`), the secret was resolved successfully. ✅

### If the Key Vault reference fails to resolve

Run this command from your local terminal to manually grant your own Azure account access to read the secret, then retrieve it:
```bash
# Get your Azure user object ID
az ad signed-in-user show --query id -o tsv

# Grant yourself access (replace <your-object-id> with the output above)
az role assignment create \
  --role "Key Vault Secrets User" \
  --assignee <your-object-id> \
  --scope "/subscriptions/<subscription-id>/resourceGroups/rg-fullshot-project/providers/Microsoft.KeyVault/vaults/<vault-name>"

# Retrieve the password
az keyvault secret show --vault-name <vault-name> --name DbAdminPassword --query value -o tsv
```

As a **temporary fallback**, you can inject the password directly into the App Service (bypassing Key Vault):
```bash
az webapp config appsettings set \
  --name <app-service-name> \
  --resource-group rg-fullshot-project \
  --settings DB_PASS='<your-password>'
```
> This is fine for a student project but should not be done in production — use Key Vault for all real deployments.

## Step 4: Connecting the App Service to GitHub (CI/CD)

Once your infrastructure finishes deploying, you need to configure your App Service to automatically pull code from your GitHub repository.

1. Open the **Azure Portal** (portal.azure.com).
2. Go to **Resource Groups** -> select `rg-fullshot-project`.
3. Click on your **App Service** (it will be named `fullshot<random-string>-app`).
4. On the left sidebar, scroll down to **Deployment Center**.
5. Set the **Source** to **GitHub**.
6. Authorize Azure to access your GitHub account if prompted.
7. Select your **Organization**, **Repository** (`HCI-FINALS-PROJECT`), and **Branch** (e.g., `main`).
8. Click **Save** at the top. 
   *Azure will automatically create a GitHub Actions workflow file in your repository and start deploying your Node.js code!*

## Step 5: Initialize the PostgreSQL Database

Because we replaced your local `coffee_shop.db` with a cloud PostgreSQL database, we need to run your `init_db.js` script to create the tables. Since your App Service handles the connections securely via Key Vault, the easiest way to do this is using SSH directly from the App Service!

> **⚠️ Important:** Azure's browser-based SSH terminal does **not** automatically resolve Key Vault secret references for environment variables. You must pass the database password explicitly as shown below.

1. In the **Azure Portal**, go back to your **App Service**.
2. On the left sidebar, under **Development Tools**, click **SSH**.
3. Click the **Go →** button. This opens a browser-based SSH terminal connected directly to your web app's container.
4. Navigate to the app directory and run the initialization script with the database password explicitly set:
   ```bash
   cd site/wwwroot
   DB_PASS='<your-db-password>' node db/init_db.js
   ```
   Replace `<your-db-password>` with the password you set in `deploy.azcli`. You can also retrieve it from the Azure Portal under **Key Vault → Secrets → DbAdminPassword → Show Secret Value**.

   *You should see output confirming that `schema_menu.sql`, `schema_users.sql`, etc. executed successfully.*

## Step 6: Decommissioning your old Virtual Machine

To avoid unwanted charges and to ensure your final project grade focuses on your new, optimized architecture, you should delete the old VM.

1. In the **Azure Portal**, go to **Virtual Machines**.
2. Select your old VM.
3. Click **Delete** at the top.
4. Ensure you also select the associated Public IP address, Network Interface, and OS Disk to completely remove all associated costs.

## Step 7: Verify Your Optimizations

Before recording your video presentation, verify your required cloud optimizations are active:
* **Optimization 1 (Scalability):** In your App Service Plan, click **Scale out (App Service plan)**. You should see your Custom Autoscale rules set to scale based on `CpuPercentage`.
* **Optimization 2 (Security):** In your **Key Vault**, click **Secrets**. You should see `DbAdminPassword`. Notice you didn't have to put this password anywhere in your GitHub code! The App Service reads it directly via its Managed Identity.
* **Optimization 3 (Monitoring):** Click on **Application Insights** and view the **Live Metrics** dashboard while clicking around your live website.

You are now ready to record your project presentation!
