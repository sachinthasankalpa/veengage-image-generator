# Venngage Icon Generator

An AI-powered web application that generates a set of **8 distinct, stylistically consistent icons** from a single user prompt.  
The application leverages a two-step AI process:
1. **Brainstorming icon ideas** with OpenAI's Responses API.
2. **Generating the individual images** in parallel using the Replicate API.

## ✨ Features
- **Prompt-Based Generation**: Create unique icons from a simple text description (e.g., *"Hockey equipment"*).
- **Style Presets**: Apply consistent visual styles like *Sticker*, *Cartoon* or *3D Model*.
- **Color Palette Control**: Steer the icon color scheme using custom colors.
- **Downloadable**: Easily download each generated icon.

## 🛠️ Tech Stack
This project is a **monorepo** managed with **Yarn Workspaces**.

### Frontend (apps/frontend)
- Framework: **React**
- Language: **TypeScript**
- Build Tool: **Vite**
- Styling: **Tailwind CSS**
- API Client: **Axios**
- UI Components: **Lucide React (Icons)**, **React Colorful (Color Picker)**

### Backend (apps/api)
- Runtime: **Node.js**
- Framework: **Express**
- Language: **TypeScript**
- AI Services:
    - **OpenAI Responses API (gpt-4.1-mini)**: For brainstorming distinct icon subjects.
    - **Replicate API (flux-schnell)**: For generating the final icon images.
- Testing: **Jest & Supertest**

## 📂 Project Structure
```bash
venngage-image-generator/
├── apps/
│   ├── api/        # Node.js / Express Backend
│   └── frontend/        # React / TypeScript Frontend
├── package.json    # Root package.json with workspace definitions
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 
- **Yarn** 
- **An OpenAI API Key**  
- **A Replicate API Token**  

### 1. Clone the Repository
```bash
git clone https://github.com/sachinthasankalpa/veengage-image-generator.git
cd vanngage-image-generator
```
### 2. Install dependencies
```bash
yarn install
```
### 3. Set Up Environment Variables
```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/api/.env.example apps/api/.env
```
- After copying env keys to .env files, update them with values.
### 4. Running the applications
- Run in two terminals
```bash
yarn dev:api
```
```bash
yarn dev:frontend
```
## Running Tests
- Currently, we only have tests for the api
```bash
yarn test:api
```

