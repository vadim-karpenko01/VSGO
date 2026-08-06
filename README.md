# Phage & Bacteria Data Platform

A modern web platform for biobanks, hospitals, researchers, and patients to upload, search, analyze, and manage phage and bacteria data—empowering phage therapy, research, and clinical applications.

## 🛠️ Getting Started
- **Node.js:** Version v22.13.0 or higher is required. Download from [nodejs.org](https://nodejs.org/).
- **Yarn:** This project requires Yarn as the package manager. Install it globally with:
  ```bash
  npm i -g yarn
  ```
  Learn more at [https://yarnpkg.com/](https://yarnpkg.com/)
- **Launch:**
  ```bash
  yarn start
  ```
  This command will automatically install dependencies and start the dev server.
- **Open:** [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Key Features
- **Phage Match:** Upload bacteria with metadata and find matching phages from the database. Filter, explore, and order phages with detailed confidence scores and suggestions for engineering if no strong match is found.
- **Phage & Bacteria Databases:** Search, filter, and explore comprehensive datasets. View detailed metadata, genome information, and availability for each entry.
- **Batch Uploads:** Support for both web forms and Excel/file uploads for efficient data entry.
- **Phage Tailor:** Suggest engineering options when no suitable phage is found.
- **Analysis Tracking:** Monitor the progress of ongoing analyses and access historical results.
- **Role-Based Access:** Tailored dashboards and permissions for hospitals, biobanks, researchers, patients, and system admins.
- **Educational Content:** Access resources, compliance indicators, and documentation.

## 🧑‍💼 User Roles & Access
- **Hospital Admin:** Manage staff, billing, and hospital data. View all activities and analysis history.
- **Hospital Staff:** Upload bacteria, request phage matches, track analyses, and access phage tailoring and databases.
- **Biobank:** Upload and manage phage data (single or batch), update metadata, and provide supporting documents.
- **Researcher:** Explore phage and bacteria banks, search/filter data, and access detailed information.
- **Patient/General User:** Browse educational content, find doctors/hospitals, and sign up for updates.
- **System Admin:** Oversee all biobanks, hospitals, users, and analyses. Manage platform-wide data and compliance.

## 📝 Metadata & Data Structure
### Bacteria Metadata
- Name, Isolation Source, Geographic Origin, Host Species, Sample Type, Origin of Infection, Time of Isolation, Co-infection Status, Strain, Biosafety Level, Previous Use, Storage & Growth Conditions, and more.

### Phage Metadata
- Name, Isolation Source, Geographic Origin, Host Species, Type (Lytic/Lysogenic), Host Availability, Genome Data, Publication Status, Storage & Purification, PFU/mL, Clinical Use, Production Quality, and more.

> Each field includes a clear description to guide users. Optional and required fields are clearly marked.

## 🖥️ Technology Stack
- **Frontend:** Next.js (React, TypeScript)
- **Package Manager:** Yarn
- **Styling:** Modern CSS (CSS Modules, Tailwind, or similar)
- **Backend:** RESTful or GraphQL API (planned)
- **Authentication:** Role-based access control

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Phage Therapy Overview](https://www.phagetherapycenter.com/)

## 🌍 Vision
Our mission is to accelerate phage therapy and research by making data accessible, actionable, and secure for all stakeholders in the fight against antibiotic resistance.
Deployment initialized
