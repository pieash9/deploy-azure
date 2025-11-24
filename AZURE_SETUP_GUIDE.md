# Complete Azure Deployment Guide - Step by Step

This guide will walk you through deploying your Next.js app to Azure Web App using GitHub Actions CI/CD.

---

## 📋 **STEP 1: Create Azure Web App**

### Option A: Using Azure Portal (Recommended for Beginners)

1. **Go to Azure Portal**
   - Visit: https://portal.azure.com
   - Sign in with your Microsoft account

2. **Create a Web App**
   - Click **"Create a resource"** (top left)
   - Search for **"Web App"** and select it
   - Click **"Create"**

3. **Configure Basic Settings**
   ```
   Subscription: [Select your subscription]
   Resource Group: Click "Create new" → Name it "nextjs-app-rg"
   
   Instance Details:
   ├─ Name: your-app-name (e.g., deploy-azure-nextjs)
   │  Note: This will be your URL: your-app-name.azurewebsites.net
   ├─ Publish: Code
   ├─ Runtime stack: Node 18 LTS
   ├─ Operating System: Linux
   └─ Region: East US (or closest to you)
   
   Pricing Plan:
   ├─ Click "Create new"
   ├─ Name: nextjs-plan
   └─ Pricing tier: Basic B1 (or Free F1 for testing)
   ```

4. **Click "Review + create"** → **"Create"**
   - Wait 1-2 minutes for deployment to complete

5. **Verify Creation**
   - Click **"Go to resource"**
   - You'll see your Web App dashboard
   - Note the URL: `https://your-app-name.azurewebsites.net`

---

### Option B: Using Azure CLI (For Advanced Users)

```bash
# Install Azure CLI first: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# 1. Login to Azure
az login

# 2. Create a resource group
az group create --name nextjs-app-rg --location eastus

# 3. Create an App Service plan
az appservice plan create \
  --name nextjs-plan \
  --resource-group nextjs-app-rg \
  --is-linux \
  --sku B1

# 4. Create the Web App
az webapp create \
  --resource-group nextjs-app-rg \
  --plan nextjs-plan \
  --name your-app-name \
  --runtime "NODE:18-lts"
```

---

## 📋 **STEP 2: Download Publish Profile**

1. **In Azure Portal**, go to your Web App dashboard

2. **Download the Publish Profile**
   - Click **"Get publish profile"** button (top menu)
   - A `.PublishSettings` file will download

3. **Open the downloaded file**
   - Open with Notepad or any text editor
   - **Copy ALL the contents** (entire XML content)
   - Keep this window open - you'll need it for Step 3

---

## 📋 **STEP 3: Configure GitHub Repository Secrets**

1. **Go to Your GitHub Repository**
   - Navigate to: `https://github.com/pieash9/deploy-azure`

2. **Access Secrets Settings**
   - Click **"Settings"** tab (top right)
   - In left sidebar: **"Secrets and variables"** → **"Actions"**

3. **Add Secret #1: AZURE_WEBAPP_NAME**
   - Click **"New repository secret"**
   - Name: `AZURE_WEBAPP_NAME`
   - Secret: `your-app-name` (the name you chose in Step 1)
   - Click **"Add secret"**

4. **Add Secret #2: AZURE_WEBAPP_PUBLISH_PROFILE**
   - Click **"New repository secret"** again
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Secret: Paste the ENTIRE contents of the `.PublishSettings` file
   - Click **"Add secret"**

### ✅ You should now have 2 secrets:
- ✓ AZURE_WEBAPP_NAME
- ✓ AZURE_WEBAPP_PUBLISH_PROFILE

---

## 📋 **STEP 4: Configure Azure Web App Settings**

1. **In Azure Portal**, go to your Web App

2. **Configure Application Settings (Environment Variables)**
   
   These are environment variables that your app needs to run properly on Azure.
   
   **Step-by-step to add each environment variable:**
   
   a. In your Web App dashboard, find the left sidebar
   
   b. Click **"Configuration"** (it has a gear icon ⚙️)
   
   c. You'll see tabs at the top - click **"Application settings"**
   
   d. Now add each environment variable one by one:
   
   **Adding Environment Variable #1:**
   - Click the **"+ New application setting"** button
   - A popup will appear with two fields:
     - **Name:** Type `WEBSITE_NODE_DEFAULT_VERSION`
     - **Value:** Type `18-lts`
   - Click **"OK"**
   
   **Adding Environment Variable #2:**
   - Click **"+ New application setting"** again
   - In the popup:
     - **Name:** Type `SCM_DO_BUILD_DURING_DEPLOYMENT`
     - **Value:** Type `false`
   - Click **"OK"**
   
   **Adding Environment Variable #3:**
   - Click **"+ New application setting"** again
   - In the popup:
     - **Name:** Type `PORT`
     - **Value:** Type `8080`
   - Click **"OK"**
   
   **Adding Environment Variable #4:**
   - Click **"+ New application setting"** again
   - In the popup:
     - **Name:** Type `NODE_ENV`
     - **Value:** Type `production`
   - Click **"OK"**
   
   e. You should now see all 4 environment variables listed
   
   f. **IMPORTANT:** Click the **"Save"** button at the TOP of the page
   
   g. A confirmation will appear - Click **"Continue"**
   
   h. Azure will restart your app (takes ~30 seconds)

3. **Set Startup Command**
   
   This tells Azure what command to run to start your app.
   
   a. Still in the **"Configuration"** section
   
   b. Click the **"General settings"** tab (next to Application settings)
   
   c. Scroll down to find **"Startup Command"** field
   
   d. In that field, type: `npm start`
   
   e. Click **"Save"** at the top → Click **"Continue"**

---

## 📋 **STEP 5: Update package.json (If Needed)**

Make sure your `package.json` has the start script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

✅ You already have this, so no changes needed!

---

## 📋 **STEP 6: Push Code to Trigger Deployment**

1. **Commit and Push Your Changes**

   ```bash
   git add .
   git commit -m "Setup Azure CI/CD deployment"
   git push origin main
   ```

2. **Watch the Deployment**
   - Go to GitHub repository
   - Click **"Actions"** tab
   - You'll see "Deploy to Azure" workflow running
   - Click on it to see live logs

3. **Deployment Process** (takes 2-5 minutes):
   ```
   ✓ Checkout code
   ✓ Setup Node.js 18
   ✓ Install dependencies (npm ci)
   ✓ Build Next.js app (npm run build)
   ✓ Deploy to Azure Web App
   ```

---

## 📋 **STEP 7: Verify Deployment**

1. **Check GitHub Actions**
   - Workflow should show ✅ green checkmark when complete

2. **Visit Your App**
   - Open: `https://your-app-name.azurewebsites.net`
   - Your Next.js app should be live! 🎉

3. **Check Azure Logs (If Issues)**
   ```bash
   # Using Azure CLI
   az webapp log tail --name your-app-name --resource-group nextjs-app-rg
   ```

   Or in Azure Portal:
   - Your Web App → **"Log stream"** (left sidebar)

---

## 🔄 **How CI/CD Works**

Every time you push to `main` branch:

```
1. GitHub Actions triggers automatically
2. Checks out your code
3. Installs Node.js 18
4. Runs npm ci (clean install)
5. Runs npm run build
6. Deploys to Azure
7. Azure restarts your app
8. App is live with new changes!
```

---

## 🛠️ **Troubleshooting**

### Issue: Deployment succeeds but app shows error

**Solution**: Check Azure logs
```bash
az webapp log tail --name your-app-name --resource-group nextjs-app-rg
```

Or in Portal: Web App → **Diagnose and solve problems**

### Issue: "Application Error" page

**Fix**:
1. Check if startup command is set to `npm start`
2. Verify PORT is set to 8080 in Configuration
3. Check if build completed successfully in GitHub Actions

### Issue: Secrets not working

**Fix**:
1. Verify secrets are named exactly:
   - `AZURE_WEBAPP_NAME`
   - `AZURE_WEBAPP_PUBLISH_PROFILE`
2. Re-download publish profile and update secret
3. Check for extra spaces in secret values

### Issue: Build fails in GitHub Actions

**Fix**:
1. Test build locally: `npm run build`
2. Check Node version matches (18)
3. Verify all dependencies are in package.json

---

## 📊 **Cost Breakdown**

| Tier | Price | Best For |
|------|-------|----------|
| **F1 (Free)** | $0/month | Testing only (60 min/day limit) |
| **B1 (Basic)** | ~$13/month | Small apps, development |
| **S1 (Standard)** | ~$70/month | Production apps |
| **P1V2 (Premium)** | ~$100/month | High traffic apps |

---

## 🎯 **Quick Reference Commands**

```bash
# View your web app
az webapp show --name your-app-name --resource-group nextjs-app-rg

# Restart web app
az webapp restart --name your-app-name --resource-group nextjs-app-rg

# View live logs
az webapp log tail --name your-app-name --resource-group nextjs-app-rg

# Delete everything (cleanup)
az group delete --name nextjs-app-rg
```

---

## ✅ **Checklist**

- [ ] Azure Web App created
- [ ] Publish profile downloaded
- [ ] GitHub secrets configured
- [ ] Azure app settings configured
- [ ] Startup command set to `npm start`
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed
- [ ] App is live and working

---

## 🚀 **Next Steps**

1. **Add Custom Domain** (Optional)
   - Web App → Custom domains → Add custom domain

2. **Enable HTTPS** (Automatic)
   - Azure provides free SSL certificate

3. **Set Up Environment Variables**
   - Add in Configuration → Application settings

4. **Monitor Performance**
   - Web App → Metrics
   - Set up Application Insights

---

## 📞 **Need Help?**

- Azure Documentation: https://docs.microsoft.com/en-us/azure/app-service/
- GitHub Actions Logs: Check the Actions tab in your repo
- Azure Support: https://portal.azure.com → Support

---

**Your app will be live at**: `https://your-app-name.azurewebsites.net` 🎉
