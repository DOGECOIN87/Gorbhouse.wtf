# GitHub Pages Deployment Guide for Gorbhouse.wtf

Complete instructions for deploying Gorbhouse to GitHub Pages with custom domain setup.

## Prerequisites

- GitHub account
- Git installed locally
- Domain registered (gorbhouse.wtf)
- Access to domain registrar's DNS settings

## Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository named `gorbhouse` (or any name)
3. Clone it locally:
```bash
git clone https://github.com/YOUR_USERNAME/gorbhouse.git
cd gorbhouse
```

### 1.2 Copy Project Files

Copy all your Gorbhouse files into the repository:
```bash
# Copy all source files
cp -r components/ services/ public/ src/ *.tsx *.ts *.json *.html .
```

### 1.3 Update vite.config.ts

Add the base path for GitHub Pages:

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/', // Use '/' for custom domain, or '/gorbhouse/' if using github.io
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

## Step 2: Create CNAME File

Create a `CNAME` file in the root directory:

```bash
echo "gorbhouse.wtf" > CNAME
```

Or create `CNAME` file with content:
```
gorbhouse.wtf
```

This tells GitHub Pages to use your custom domain.

## Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: gorbhouse.wtf
```

## Step 4: Configure DNS Settings

### 4.1 Get GitHub Pages IP Addresses

GitHub Pages uses these IP addresses:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 4.2 DNS Configuration at Your Registrar

Log into your domain registrar (GoDaddy, Namecheap, etc.) and update DNS records:

#### Option A: Using A Records (Recommended)

Add 4 A records pointing to GitHub's IPs:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

#### Option B: Using CNAME Record

If your registrar doesn't allow multiple A records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | YOUR_USERNAME.github.io | 3600 |

Then add A records for the root domain (@) as shown in Option A.

#### Option C: Using ALIAS/ANAME Record (Some Registrars)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| ALIAS/ANAME | @ | YOUR_USERNAME.github.io | 3600 |

### 4.3 Example: GoDaddy DNS Setup

1. Log into GoDaddy
2. Go to DNS Management
3. Find "A" records section
4. Add/Edit records:
   - Name: @ (or leave blank)
   - Type: A
   - Value: 185.199.108.153
   - TTL: 3600
5. Repeat for other 3 IP addresses
6. Save changes

### 4.4 Example: Namecheap DNS Setup

1. Log into Namecheap
2. Go to Domain List
3. Click "Manage" next to gorbhouse.wtf
4. Go to "Advanced DNS"
5. Add A records:
   - Host: @
   - Type: A
   - Value: 185.199.108.153
   - TTL: 3600
6. Repeat for other 3 IP addresses
7. Save changes

## Step 5: Configure GitHub Repository Settings

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select branch: `gh-pages`
6. Under "Custom domain", enter: `gorbhouse.wtf`
7. Check "Enforce HTTPS"
8. Click "Save"

GitHub will automatically create the CNAME file if you enter the domain here.

## Step 6: Deploy Your Application

### 6.1 Initial Setup

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Gorbhouse with Solana wallet integration"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/gorbhouse.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 6.2 GitHub Actions Will Automatically:

1. Install dependencies
2. Build the project (`npm run build`)
3. Deploy to `gh-pages` branch
4. Publish to GitHub Pages

### 6.3 Monitor Deployment

1. Go to your repository
2. Click "Actions" tab
3. Watch the workflow run
4. Once complete, your site is live!

## Step 7: Verify DNS Propagation

DNS changes can take 24-48 hours to propagate globally.

### Check DNS Status

```bash
# Check A records
nslookup gorbhouse.wtf

# Check CNAME records
nslookup www.gorbhouse.wtf

# Detailed DNS info
dig gorbhouse.wtf

# Check GitHub Pages
dig gorbhouse.wtf +short
```

### Online Tools

- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)
- [MXToolbox](https://mxtoolbox.com/dnscheck.aspx)

## Step 8: Test Your Site

1. Wait for DNS propagation (can take up to 48 hours)
2. Visit `https://gorbhouse.wtf`
3. Verify HTTPS works (green lock icon)
4. Test wallet connection
5. Test tipping functionality

## Troubleshooting

### DNS Not Resolving

- Wait 24-48 hours for propagation
- Clear browser cache
- Try incognito/private mode
- Check DNS records are correct
- Use `nslookup` or `dig` to verify

### HTTPS Not Working

- Wait for GitHub to issue SSL certificate (can take 24 hours)
- Ensure "Enforce HTTPS" is checked in settings
- Clear browser cache

### Site Shows 404

- Verify `CNAME` file exists in repository
- Check GitHub Pages settings
- Ensure build was successful in Actions
- Check `dist/` folder was created

### Build Fails

- Check `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node version compatibility
- Review GitHub Actions logs

## Updating Your Site

After initial deployment, updates are automatic:

```bash
# Make changes locally
# Commit and push
git add .
git commit -m "Update: [description]"
git push origin main

# GitHub Actions automatically builds and deploys
```

## Performance Optimization

### Enable Caching

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18'
    cache: 'npm'  # This enables npm cache
```

### Optimize Build

Update `vite.config.ts`:

```typescript
build: {
  minify: 'terser',
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        'solana': ['@solana/web3.js', '@solana/wallet-adapter-react'],
      }
    }
  }
}
```

## SSL/HTTPS Certificate

GitHub Pages automatically provides free SSL certificates via Let's Encrypt:

1. Certificate is issued automatically
2. Renews automatically
3. Takes up to 24 hours to issue
4. Ensure "Enforce HTTPS" is enabled

## Custom Domain with www

To support both `gorbhouse.wtf` and `www.gorbhouse.wtf`:

### DNS Records

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | gorbhouse.wtf |

### GitHub Pages Settings

- Custom domain: `gorbhouse.wtf`
- GitHub automatically handles www redirect

## Monitoring & Analytics

### Add Google Analytics

1. Create Google Analytics account
2. Get tracking ID
3. Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Commit and push
git add package*.json
git commit -m "Update dependencies"
git push origin main
```

### Monitor Deployments

1. Check GitHub Actions regularly
2. Monitor site uptime
3. Test wallet functionality
4. Check error logs

## Rollback

If deployment fails:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push origin main --force
```

## Support & Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [DNS Propagation Checker](https://dnschecker.org/)

## Checklist

- [ ] Repository created on GitHub
- [ ] CNAME file added to repository
- [ ] GitHub Actions workflow created
- [ ] DNS A records configured
- [ ] GitHub Pages settings configured
- [ ] Custom domain entered in settings
- [ ] HTTPS enforcement enabled
- [ ] Initial push to main branch
- [ ] GitHub Actions deployment successful
- [ ] DNS propagation verified
- [ ] Site accessible at gorbhouse.wtf
- [ ] HTTPS working (green lock)
- [ ] Wallet connection tested
- [ ] Tipping functionality tested

## Next Steps

1. Create GitHub repository
2. Configure DNS records
3. Set up GitHub Actions
4. Deploy and test
5. Monitor for issues
6. Celebrate! 🎉

---

**Your Gorbhouse app will be live at https://gorbhouse.wtf once DNS propagates!**
