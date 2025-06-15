import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/chat", {
        message,
      });
      setResponse(res.data.reply);
    } catch (error: any) {
      console.error(error);
      setResponse(
        error.response?.data?.error || "Error: unable to connect to assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 ChatGPT Book Assistant</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask for a book recommendation..."
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Send" onPress={handleSend} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        response !== "" && (
          <View style={styles.responseBox}>
            <Text style={styles.label}>Assistants reply:</Text>
            <Text>{response}</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    minHeight: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  responseBox: {
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
