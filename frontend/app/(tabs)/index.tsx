import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

// Cambia esta IP por la IP de tu computadora en la red local
const BACKEND_URL = "http://192.168.0.217:3001";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Verificar la conexión al backend al iniciar
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/test`, {
        timeout: 5000, // 5 segundos de timeout
      });
      if (response.data.status === "ok") {
        setIsConnected(true);
        setMessages([
          {
            role: "assistant",
            content:
              "¡Hola! Soy tu asistente de libros. ¿Qué tipo de libros te gustan?",
          },
        ]);
      }
    } catch (error: any) {
      console.error("Error de conexión:", error.message);
      setIsConnected(false);
      let errorMessage = "No se pudo conectar al servidor. ";

      if (error.code === "ECONNABORTED") {
        errorMessage += "El servidor no respondió a tiempo. ";
      } else if (error.code === "ECONNREFUSED") {
        errorMessage += "La conexión fue rechazada. ";
      } else if (error.response) {
        errorMessage += `Error ${error.response.status}: ${error.response.data}. `;
      } else if (error.request) {
        errorMessage += "No se recibió respuesta del servidor. ";
      }

      errorMessage +=
        "\n\nVerifica que:\n" +
        "1. El servidor esté corriendo\n" +
        "2. Estés en la misma red WiFi que la computadora\n" +
        "3. La IP en BACKEND_URL sea correcta\n\n" +
        "IP actual: " +
        BACKEND_URL;

      Alert.alert("Error de conexión", errorMessage);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    Keyboard.dismiss();

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        message,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "No se pudo conectar al asistente. Verifica tu conexión o IP local.",
        },
      ]);
      // Intentar reconectar
      checkBackendConnection();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          <Text style={styles.title}>📚 ChatGPT Book Assistant</Text>

          {!isConnected && (
            <View style={styles.connectionWarning}>
              <Text style={styles.warningText}>No conectado al servidor</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={checkBackendConnection}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}

          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="small" />
              <Text style={{ marginLeft: 10 }}>Pensando...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contame qué buscás..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || !isConnected) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim() || !isConnected}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f8f9fa",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4A5568",
    borderRadius: 20,
    padding: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  loading: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  connectionWarning: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  warningText: {
    color: "#856404",
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: "#856404",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
  },
});
