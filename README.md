# 📚 ChatGPT Book Assistant

A mobile application developed with **React Native (Expo)** and **Node.js + Express** that allows users to get personalized book recommendations using the **ChatGPT API**. The project promotes best practices in front-end and back-end integration, as well as the use of external AI APIs.

---

## 🗂️ Project Structure

```
chatgpt-book-assistant/
├── backend/     # Express server + connection to OpenAI
│   ├── index.js
│   ├── .env.example
│   ├── package.json
│   └── ...
│
└── frontend/    # Mobile app built with Expo
    ├── app/
    ├── assets/
    ├── components/
    ├── package.json
    └── ...
```

---

## 🚀 Technologies Used

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **API:** OpenAI ChatGPT (`gpt-3.5-turbo`)
- **Others:** Axios, dotenv, CORS

---

## 📦 Prerequisites

- Node.js v20 or higher
- Expo CLI:  
  ```bash
  npm install -g expo-cli
  ```
- [OpenAI](https://platform.openai.com/) account with an active API key

---

## 🔧 Installation & Running

### 1. Clone the Repository

```bash
git clone https://github.com/your-user/chatgpt-book-assistant.git
cd chatgpt-book-assistant
```

---

### 2. Backend (Express)

```bash
cd backend
cp .env.example .env     # Copy the file and add your OpenAI API key
npm install
node index.js
```

The server will run at:  
```
http://localhost:3001
```

> ⚠️ If you're using a physical device or emulator, make sure to configure network access properly in Expo.

---

### 3. Frontend (React Native with Expo)

```bash
cd ../frontend
npm install
npx expo start
```

---

You're all set! Start searching for books and get AI-powered recommendations.
