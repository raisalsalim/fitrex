# Fitrex - Gym Workout Logger, Posture Guide & Progress Analytics

Fitrex is a modern, high-performance, mobile-responsive workout tracker and body progress logger designed for **100% free hosting on GitHub Pages** with **100% free cross-network cloud sync via private GitHub Gists**.

---

## Key Features

1. **Workout & Muscle Logging**:
   - Auto date & day-of-week detection with quick day switcher.
   - Multi-muscle targeting (Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Abs, Forearms, Cardio).
   - Dynamic sets, reps, and weights table with previous session performance reference.
   - Set completion checkboxes, Personal Record (PR) celebration confetti, and quick duplicate/add set tools.
2. **Posture & Form Guidance**:
   - Built-in form guide with embedded YouTube tutorial video previews.
   - Form cues and common posture mistakes to avoid.
   - Support for custom video links and personal setup notes.
3. **Body Metrics & BMI**:
   - Date-stamped body weight, height, and waist tracking.
   - Automatic BMI calculation with color-coded health zone gauge.
   - Interactive SVG weight progression curve.
4. **Exercise Progression & PRs**:
   - Exercise progress tracker displaying max weight lifted, estimated 1-Rep Max (1RM), and total volume trends over time.
   - Personal Records trophy cabinet.
5. **Security PIN Screen**:
   - Protects your personal logs from unauthorized visitors since GitHub Pages URLs are public.
   - Auto-lock timeout and instant manual lock.
6. **Multi-User Profiles**:
   - Create and switch between profiles (e.g. "Raisal", "Partner", "Friend").
   - Isolated logs, PRs, and body metrics per profile.
7. **100% Free Cross-Device Cloud Sync (GitHub Gist)**:
   - Uses a private, secret Gist on your own GitHub account to keep your workouts in sync across your phone and laptop on different Wi-Fi or mobile data networks.
   - No paid databases or third-party servers needed.
8. **Gym Rest Timer**:
   - Floating timer with audio synthesizer chimes (Web Audio API) and vibration alerts.

---

## How to Deploy to GitHub Pages (100% Free)

### Step 1: Push Code to a GitHub Repository
1. Create a new repository on [GitHub](https://github.com/new) named `fitrex`.
2. Push your project:
```bash
git init
git add .
git commit -m "Initial release of Fitrex"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitrex.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in 1 Click
1. Go to your repository on GitHub.
2. Click **Settings** → **Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. That's it! The included `.github/workflows/deploy.yml` will automatically build and deploy your site to:
   `https://YOUR_USERNAME.github.io/fitrex/`

---

## How to Sync Between Mobile and Laptop (Free GitHub Gist)

1. On GitHub, create a Personal Access Token with the `gist` permission:
   - Go to [GitHub Token Settings](https://github.com/settings/tokens/new?description=Fitrex+Sync&scopes=gist)
   - Ensure `gist` is checked and click **Generate token**.
2. Open **Fitrex** on your laptop or phone.
3. Tap **Settings (⚙️)** → **100% Free Cloud Sync**.
4. Paste your token and tap **Connect & Sync Now**.
5. Paste the same token on your phone, and your workouts and body logs will automatically synchronize across all devices on any network!
