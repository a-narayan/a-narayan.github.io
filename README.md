# Intelligent Data Science Lab (IDSL) Website

Official web portal and Content Management System (CMS) for the **Intelligent Data Science Lab (IDSL)** led by **Dr. Apurva Narayan**, spanning **Western University**, the **University of British Columbia (UBC)**, and the **University of Waterloo**.

IDSL conducts research at the intersection of **Machine Learning**, **Data Science**, **Software Engineering**, and **Safety & Security of Cyber-Physical Systems (CPS)**.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v16.x or higher (Node v18 / v20 LTS recommended)
- **npm**: v8.x or higher
- **Git**

> **Tip:** If you use [nvm](https://github.com/nvm-sh/nvm), switch to your preferred Node version:
> ```bash
> nvm use 18 # or nvm use 20 / 16
> ```

---

### Step-by-Step Setup

1. **Clone the repository** (if not already cloned):
   ```bash
   git clone https://github.com/your-username/idsl_website.git
   cd idsl_website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: If you run into any peer dependency warnings with newer Node versions, use `npm install --legacy-peer-deps`)*

3. **Start the local development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Open [http://localhost:3000](http://localhost:3000) to view the application. The page will reload automatically if you make edits.

---

## 🛠 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000). |
| `npm run build` | Builds the app for production into the `build/` folder with optimizations. |
| `npm test` | Launches the test runner in interactive watch mode. |
| `npm run deploy` | Builds the project and deploys it directly to GitHub Pages (`gh-pages`). |

---

## 🧱 Tech Stack

- **Frontend Core**: [React 18](https://react.dev/), [React Router v6](https://reactrouter.com/) (using `HashRouter` for GitHub Pages compatibility)
- **UI & Styling**: [Material UI (MUI v5)](https://mui.com/), `@emotion/react`, `@emotion/styled`
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & `react-redux`
- **Database & Cloud Storage**: [Google Firebase v10](https://firebase.google.com/) (Cloud Firestore & Firebase Storage)
- **Publication Parsing**: `bibtex-parse-js` for automated BibTeX bibliography parsing
- **Rich Text Editing**: `react-quill` for WYSIWYG administrative content management
- **Date Handling**: `dayjs` and `@mui/x-date-pickers`

---

## 📁 Project Structure

```text
idsl_website/
├── public/                 # Static public assets (HTML template, icons)
├── src/
│   ├── assets/             # Brand logos, images, and static graphics
│   ├── components/         # Reusable UI components (DAppBar, Footer, DCard, DButton, etc.)
│   ├── constants/          # Design tokens (colors, theme configurations)
│   ├── features/           # Redux slices (publications, team, news, user, highlights, resources)
│   ├── firebase-setup/     # Firebase SDK initialization and Firestore/Storage config
│   ├── hooks/              # Custom React hooks (e.g., useAlerts)
│   ├── pages/
│   │   ├── public/         # Public-facing views
│   │   │   ├── home/           # Landing page with hero, highlights, and news
│   │   │   ├── research/       # Research themes, domains, and partner showcases
│   │   │   ├── publications/   # Searchable and parsed publication entries
│   │   │   ├── team/           # Active members, alumni directory, and member details
│   │   │   ├── news/           # Lab updates and individual article view
│   │   │   ├── opportunities/  # Recruitment information for prospective students
│   │   │   └── resources/      # Datasets, benchmarks, and open-source tools
│   │   ├── admin/          # Content Management System (CMS) & Dashboard
│   │   │   ├── login/          # Secure admin & member authentication
│   │   │   ├── dashboard/      # Admin navigation console
│   │   │   └── admin-components/ # Modular Block Editor (Text, Images)
│   │   └── student/        # Self-service portal for lab members to update profiles
│   ├── sections/           # Shared section components (Images, Quill Editor)
│   ├── utils/              # Helper utilities (bibTexUtils, encryptionUtils, dateUtils)
│   ├── App.js              # Application routing and root layout
│   └── index.js            # React DOM mounting and Redux store provider
└── package.json            # Dependencies and npm scripts
```

---

## 🔐 Configuration & Environment

- **Firebase Config**: The Firebase client config is initialized in [`src/firebase-setup/firebase.js`](src/firebase-setup/firebase.js). It connects to Firestore for dynamic data synchronization (publications, news, member lists, and page content).
- **Authentication**: Supports administrative permissions (`admin`) and student self-service editing (`student`).

---

## 🌐 Lab Information & Contact

- **Lab Director**: Dr. Apurva Narayan
- **Affiliations**:
  - Department of Computer Science & ECE, **Western University**
  - Department of Computer Science & School of Engineering, **University of British Columbia**
  - Department of Systems Design Engineering, **University of Waterloo**
- **Address**: MC - 368, 1151 Richmond St, London, ON N6A 3K7, Canada
- **Emails**: `apurva.narayan@uwo.ca` · `apurva.narayan@ubc.ca` · `apurva.narayan@uwaterloo.ca`
