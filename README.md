# 📚 ChatGPT Book Assistant

Una aplicación móvil desarrollada con **React Native (Expo)** y **Node.js + Express** que permite a los usuarios obtener recomendaciones personalizadas de libros utilizando la **API de ChatGPT**. El proyecto promueve buenas prácticas de integración entre frontend y backend, además del uso de APIs externas de inteligencia artificial.

---

## 🗂️ Estructura del Proyecto

```
chatgpt-book-assistant/
├── backend/     # Servidor Express + conexión con OpenAI
│   ├── index.js
│   ├── .env.example
│   ├── package.json
│   └── ...
│
└── frontend/    # Aplicación móvil con Expo
    ├── app/
    ├── assets/
    ├── components/
    ├── package.json
    └── ...
```

---

## 🚀 Tecnologías Utilizadas

- **Frontend:** React Native (Expo)
- **Backend:** Node.js + Express
- **API:** OpenAI ChatGPT (`gpt-3.5-turbo`)
- **Otros:** Axios, dotenv, CORS

---

## 📦 Requisitos Previos

- Node.js v20 o superior
- Expo CLI:  
  ```bash
  npm install -g expo-cli
  ```
- Cuenta de [OpenAI](https://platform.openai.com/) con una clave API activa

---

## 🔧 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-user/chatgpt-book-assistant.git
cd chatgpt-book-assistant
```

---

### 2. Backend (Express)

```bash
cd backend
cp .env.example .env     # Copiá el archivo y agregá tu clave de API de OpenAI
npm install
node index.js
```

El servidor se ejecutará en:  
```
http://localhost:3001
```

> ⚠️ Si estás utilizando un emulador o un dispositivo físico, revisá la configuración de red en Expo.

---

### 3. Frontend (React Native con Expo)

```bash
cd ../frontend
npm install
npx expo start
```

---

¡Listo! Ahora podés empezar a buscar libros y recibir recomendaciones impulsadas por IA.
