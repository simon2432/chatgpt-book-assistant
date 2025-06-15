const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS más permisiva para desarrollo
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Ruta de prueba para verificar la conexión
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "Backend is running!" });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente especializado en recomendar libros. Responde de manera concisa y amigable, enfocándote en recomendar libros basados en los intereses del usuario. Si el usuario no menciona un género específico, pregunta por sus preferencias. Limita tus respuestas a 2-3 oraciones.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error en /chat:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud",
      details: error.message,
    });
  }
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    details: err.message,
  });
});

// Iniciar el servidor en todas las interfaces
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
  console.log(
    "Para acceder desde otros dispositivos, usa la IP de tu computadora en la red local"
  );
});
