# 🚀 Deploy ResuméPro to GitHub Pages

## Your folder structure (already done)
```
resume-pro/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js
    ├── App.js
    └── ResumePro.jsx
```

---

## Step 1 — Install Node.js
Download and install from: https://nodejs.org (choose LTS version)

---

## Step 2 — Open this folder in your terminal
Right-click the `resume-pro` folder → "Open in Terminal" (Windows)
Or open Terminal and type:
```
cd path/to/resume-pro
```

---

## Step 3 — Install dependencies
```
npm install
```

---

## Step 4 — Test it locally first
```
npm start
```
Opens at http://localhost:3000 — confirm it works, then close with Ctrl+C.

---

## Step 5 — Create a GitHub repo
1. Go to https://github.com and sign in (create account if needed)
2. Click the green "New" button
3. Name it: `resume-pro`
4. Leave everything else default → click "Create repository"

---

## Step 6 — Edit package.json
Open `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
```
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/resume-pro"
```

---

## Step 7 — Connect your folder to GitHub
Copy the commands GitHub shows you after creating the repo. They look like:
```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume-pro.git
git push -u origin main
```

---

## Step 8 — Deploy to GitHub Pages
```
npm run deploy
```
This builds the app and pushes it to a special `gh-pages` branch automatically.

---

## Step 9 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Branch", select **gh-pages** → click **Save**

---

## ✅ Done!
Your app will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/resume-pro
```
(May take 1–2 minutes to go live the first time)

Open this URL on your phone — it works like a website, no install needed!

---

## 🔄 To update in the future
After making changes to your code:
```
npm run deploy
```
That's it — re-runs build and pushes the update.
