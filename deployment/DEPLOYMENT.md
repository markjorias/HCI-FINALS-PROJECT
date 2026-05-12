# Deliverable 2: Deployment Documentation

This repository utilizes **Method A (Code)** for infrastructure deployment, using Azure Bicep and the Azure CLI. This approach ensures a repeatable, version-controlled, and secure environment.

## 1. Resource Mapping
The following table maps the deployed infrastructure to the specific requirements of Deliverable 2:

| Requirement | Azure Resource | Specification |
| :--- | :--- | :--- |
| **1. Resource Group** | `rg-fullshot-project` | Logical container for all project assets, deployed in `eastasia`. |
| **2. Core Compute** | Azure App Service | Hosted on an **S1 Plan** with **2+ instances** (Autoscale enabled) for high availability. |
| **3. Data Resource** | PostgreSQL Flexible Server | Burstable B1ms tier with 32GB Premium SSD storage. |
| **4. Security Control** | Azure Key Vault + Managed Identity | Passwordless authentication using RBAC and System-Assigned Identity. |

---

## 2. Infrastructure as Code (Bicep) Specifications

### Bicep Parameters
The `main.bicep` template utilizes the following parameters for flexible deployment:
* `location`: The Azure region (defaults to Resource Group location).
* `baseName`: Unique prefix for resource naming to avoid global DNS conflicts.
* `dbAdminUsername`: The administrator login for the PostgreSQL server.
* `dbAdminPassword`: (Secure) The database password, automatically injected into Key Vault.

### Security Implementation
We have implemented **Advanced Security Controls** by eliminating hardcoded credentials:
1. **Managed Identity**: The App Service is assigned a unique identity in Azure AD.
2. **Key Vault RBAC**: Bicep creates a role assignment granting the App Service identity the `Key Vault Secrets User` role.
3. **Runtime Resolution**: The application fetches the `DB_PASS` secret directly from Key Vault at runtime using the `@Microsoft.KeyVault` reference syntax.

---

## 3. Deployment Instructions

### Prerequisites
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (v2.40.0+)
* Active **Azure for Students** subscription.
* **One-Time Provider Registration**:
  ```bash
  az provider register --namespace Microsoft.AlertsManagement
  ```

### Deployment Steps
1. **Environment Setup**: Ensure your `.env` file in the project root contains a secure `DB_PASSWORD`.
2. **Authentication**:
   ```bash
   az login
   ```
3. **Execute Deployment Script**:
   ```bash
   cd deployment
   bash deploy.azcli
   ```
   *The script creates the Resource Group and triggers the Bicep orchestration.*

---

## 4. Post-Deployment & Verification

### Database Initialization
Once the infrastructure is ready, initialize the schema via the Azure SSH terminal:
```bash
# Navigate to application root and run init script
node db/init_db.js
```

### Verification Commands
Use these commands to verify the state of your deployment:
```bash
# List all resources in the group
az resource list --resource-group rg-fullshot-project --output table

# Check App Service scale status
az webapp show --name <app-name> --resource-group rg-fullshot-project --query "sku"
```

---

## 5. Troubleshooting
| Symptom | Resolution |
| :--- | :--- |
| `MissingSubscriptionRegistration` | Register the `AlertsManagement` provider as shown in Prerequisites. |
| Key Vault Name Conflict | Purge the soft-deleted vault using `az keyvault purge --name <vault-name>`. |
| `DB_PASS` not resolving | Wait 5 minutes for RBAC propagation and restart the App Service. |

---
**References:**
* [Bicep Deployment Documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deployment-script-develop?tabs=CLI)
* [Maintainer CHANGELOG](../CHANGELOG.md)
