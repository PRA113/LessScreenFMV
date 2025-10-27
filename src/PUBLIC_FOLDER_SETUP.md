# 📁 Public Folder Setup Instructions

## ✅ Code Updates Completed

All references to the logo have been updated in the codebase:
- ✅ `OnboardingStart.tsx` - Updated to use `/logo.png`
- ✅ `Dashboard.tsx` - Updated to use `/logo.png`
- ✅ Alt attributes set to "LessScreen Logo"

## 🚨 REQUIRED: Manual Logo Export

You need to complete these steps manually:

### Step 1: Create Public Folder

In your project root directory, create a `/public` folder if it doesn't exist:

```bash
mkdir public
```

### Step 2: Export Logo from Figma

1. Open your Figma design
2. Find the LessScreen logo (currently at asset ID: `2f1ee823d60cadaee7aa808915269a608e632061`)
3. Select the logo
4. Right-click → Export → PNG
5. Export settings:
   - **Format:** PNG
   - **Resolution:** 2x or 3x (for retina displays)
   - **Recommended size:** 512x512px or higher

### Step 3: Save Logo to Public Folder

1. Rename the exported file to **exactly:** `logo.png` (lowercase, case-sensitive)
2. Move/copy the file to: `/public/logo.png`

Your file structure should look like this:

```
your-project/
├── public/
│   └── logo.png          ← The logo file here
├── components/
│   ├── Dashboard.tsx
│   └── OnboardingStart.tsx
├── App.tsx
└── ...
```

### Step 4: Verify the Logo Works

After adding the file, start your development server:

```bash
npm run dev
```

Then verify:

1. ✅ Logo appears on the Onboarding Start screen
2. ✅ Logo appears in the Dashboard (top-right corner)
3. ✅ Navigate to `http://localhost:3000/logo.png` - you should see the logo
4. ✅ No console errors about missing images

## 🎨 Logo Specifications

Based on the code, the logo is used in two places:

### 1. OnboardingStart Screen
- **Size:** 192px × 192px (w-48 h-48)
- **Effect:** Drop shadow with purple glow
- **Animation:** Gentle floating animation
- **Purpose:** Main welcome screen

### 2. Dashboard Header
- **Size:** 48px × 48px (w-12 h-12)
- **Effect:** Drop shadow
- **Position:** Top-right corner
- **Purpose:** Branding

**Recommendation:** Export the logo at **512px × 512px** minimum to ensure it looks crisp on all devices.

## 🔧 Troubleshooting

### Logo not showing?

**Check 1: File exists**
```bash
ls -la public/logo.png
# Should show: logo.png
```

**Check 2: Correct filename (case-sensitive)**
- ✅ Correct: `logo.png`
- ❌ Wrong: `Logo.png`, `LOGO.png`, `logo.PNG`

**Check 3: File is in public folder**
```bash
# Should be at project root
public/logo.png
# NOT at
src/public/logo.png
components/public/logo.png
```

**Check 4: Browser cache**
- Clear your browser cache
- Hard reload: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

**Check 5: Dev server restarted**
```bash
# Stop the dev server (Ctrl+C)
# Start it again
npm run dev
```

### Still not working?

Check the browser console (F12) for errors. Common issues:

```
404 Not Found: /logo.png
→ File is not in the /public folder

Failed to load resource
→ File is corrupted or wrong format

CORS Error
→ File permissions issue
```

## 📦 For Production Deployment

When deploying to Vercel/Netlify/etc.:

1. ✅ Ensure `/public/logo.png` is committed to Git
2. ✅ Verify the file is included in your build
3. ✅ Test on the deployed URL: `https://your-domain.com/logo.png`

## ✨ Alternative: Use Base64 Encoded Logo

If you want to avoid the external file, you can convert the logo to Base64:

1. Convert PNG to Base64: https://www.base64-image.de/
2. Update the `src` attributes:

```tsx
<img 
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." 
  alt="LessScreen Logo"
/>
```

**Pros:** No external file needed  
**Cons:** Larger bundle size, harder to update

## 🎯 Current Status

- ✅ Code updated to reference `/logo.png`
- ✅ Alt attributes set to "LessScreen Logo"
- ⏳ **Waiting for you to add the logo file to `/public/logo.png`**

Once you complete Step 1-3 above, everything will work! 🚀
