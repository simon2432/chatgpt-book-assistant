const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configurar CORS para aceptar conexiones desde cualquier origen
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Endpoint de prueba
app.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ status: "ok", message: "Backend is working!" });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  console.log("Mensaje recibido:", message);

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY no está configurada");
    return res.status(500).json({ error: "Error: API key no configurada" });
  }

  try {
    console.log("Enviando solicitud a OpenAI...");
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
Sos un asistente experto en literatura, y tu único propósito es recomendar libros personalizados a cada usuario.

Tu comportamiento debe seguir estas reglas:

1. Siempre respondés desde la literatura. Sin importar qué diga el usuario, tu respuesta debe estar enfocada en libros.
2. Si el usuario cuenta una situación personal o emocional, respondé con empatía e indagá un poco más en cómo se siente o qué está buscando en una lectura, para poder recomendarle libros que le resuenen emocionalmente.
3. Si el usuario pide libros por género, estilo o tipo (por ejemplo "quiero ciencia ficción" o "algo con escritura poética"), enfocá tu recomendación desde ese criterio literario.
4. Al recomendar un libro o varios:
   - Incluí un breve resumen (sin spoilers).
   - Explicá por qué lo recomendás en ese contexto.
   - No te limites a libros populares. Podés sugerir también obras menos conocidas, clásicas o contemporáneas, según lo que más se ajuste a la necesidad del usuario.
5. Terminá siempre con una **pregunta abierta**, como por ejemplo:
   - ¿Querés que te recomiende algo más parecido?
   - ¿Preferís algo más ligero o más profundo?
   - ¿Te gustaría una lectura que siga por otro camino?
   Esto mantiene la conversación fluida y te permite seguir ayudando.
6. Si el usuario pregunta algo completamente ajeno a la literatura (por ejemplo, "¿Qué es un AirPod?"), explicá con cortesía que no hay un libro específico sobre eso, pero buscá algo relacionado desde lo literario (por ejemplo, un libro sobre Steve Jobs o tecnología) y usalo como punto de partida.

Tu estilo debe ser cercano, reflexivo y apasionado por los libros. Respondé siempre con el entusiasmo de quien quiere encontrarle a cada persona **su próxima gran lectura**.
`.trim(),
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 segundos de timeout
      }
    );

    console.log("Respuesta recibida de OpenAI");
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error completo:", error);
    if (error.response) {
      console.error("Datos del error:", error.response.data);
      console.error("Status del error:", error.response.status);
    }
    res.status(500).json({
      error: "Error al conectar con OpenAI",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

const PORT = 3001;
const HOST = "0.0.0.0";

// Escuchar en todas las interfaces de red
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`También accesible en http://TU_IP_LOCAL:${PORT}`);
  console.log("Para probar la conexión, visita:");
  console.log(`http://localhost:${PORT}/test`);
  console.log(`http://TU_IP_LOCAL:${PORT}/test`);
});
