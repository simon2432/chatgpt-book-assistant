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
  Dimensions,
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
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  // Responsive width and chat height
  const windowWidth = Dimensions.get("window").width;
  const isWeb = Platform.OS === "web";
  const cardMaxWidth = isWeb ? 700 : 400;
  const cardPadding = isWeb ? 48 : 28;
  const chatMinHeight = isWeb ? 320 : 180;

  // Verificar la conexión al backend al iniciar
  useEffect(() => {
    checkBackendConnection();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardOffset(e.endCoordinates.height);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOffset(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2D1B13" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.cardBox,
              { maxWidth: cardMaxWidth, padding: cardPadding },
            ]}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>☕️📖</Text>
            </View>
            <Text style={styles.welcomeTitle}>Bienvenido</Text>
            <View style={styles.divider} />
            <View style={[styles.chatScrollWrapper, { flex: 1 }]}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={[
                  styles.chatContainer,
                  { minHeight: chatMinHeight, paddingBottom: 12 },
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
                {!isConnected && (
                  <View style={styles.connectionWarning}>
                    <Text style={styles.warningText}>
                      No conectado al servidor
                    </Text>
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
                    <ActivityIndicator size="small" color="#A68A64" />
                    <Text style={{ marginLeft: 10, color: "#A68A64" }}>
                      Pensando...
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
            <View
              style={[
                styles.inputContainer,
                { marginBottom: Platform.OS === "ios" ? keyboardOffset : 0 },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Contame qué buscás..."
                placeholderTextColor="#A68A64"
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!message.trim() || !isConnected) &&
                    styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!message.trim() || !isConnected}
              >
                <Text style={styles.sendButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  cardBox: {
    width: "95%",
    backgroundColor: "#3E2417",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
    minHeight: 400,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    fontSize: 54,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F5D7A1",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#E2C9A0",
    marginBottom: 18,
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#A68A64",
    marginBottom: 12,
    opacity: 0.2,
  },
  chatScrollWrapper: {
    flex: 1,
    width: "100%",
    minHeight: 100,
  },
  chatContainer: {
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#A68A64",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E2C9A0",
  },
  messageText: {
    fontSize: 16,
    color: "#3E2417",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 90,
    padding: 12,
    borderWidth: 1,
    borderColor: "#A68A64",
    borderRadius: 12,
    backgroundColor: "#2D1B13",
    color: "#F5D7A1",
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#E2C9A0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#b8a07a",
  },
  sendButtonText: {
    color: "#3E2417",
    fontWeight: "bold",
    fontSize: 16,
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
