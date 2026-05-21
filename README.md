# Resume-Pro 📄✨

An AI-powered resume toolkit that helps you build, analyze, and optimize your resume — powered by Groq's blazing-fast LLaMA 3.3 model.

🌐 **Live Demo:** [ayush-io-code.github.io/Resume-pro](https://ayush-io-code.github.io/Resume-pro/)

---

## Features

- **AI Resume Builder** — Generate a professional resume from scratch with AI guidance
- **Resume Analyzer & Scorer** — Get an instant score and detailed feedback on your resume
- **PDF Resume Parser** — Upload your existing PDF resume and let AI analyze it
- **ATS Score Checker** — Check how well your resume passes Applicant Tracking Systems
- **AI Suggestions & Feedback** — Receive actionable tips to improve content, formatting, and keywords
- **Download / Export** — Export your optimized resume for job applications

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| AI Model | LLaMA 3.3 70B (via Groq API) |
| PDF Parsing | PDF.js |
| Hosting | GitHub Pages |
| Deployment | gh-pages |

---

## Getting Started

### Prerequisites

- Node.js >= 14
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ayush-io-code/Resume-pro.git

# Navigate into the project
cd Resume-pro

# Install dependencies
npm install
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

### Deploying to GitHub Pages

```bash
npm run deploy
```

---

## Usage

1. **Upload your resume** — Drop in a PDF or start from scratch
2. **Get your ATS score** — See how recruiters' systems rate your resume
3. **Review AI feedback** — Read suggestions to improve keywords, structure, and impact
4. **Download** — Export your polished resume ready for applications

---

## Project Structure

```
Resume-Pro/
├── public/
├── src/
│   ├── App.js              # Root app component
│   ├── ResumePro.jsx       # Core application (builder, analyzer, parser)
│   └── index.js            # Entry point
├── .env                    # API keys (not committed)
├── .gitignore
├── package.json
└── README.md

---

## Known Limitations

- PDF parsing requires selectable text — scanned image PDFs are not supported.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)

---

<p align="center">Made with ❤️ by <a href="https://github.com/Ayush-io-code">Ayush</a></p>
