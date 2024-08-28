import React, { useContext, useState } from "react";
import { Alert, View, Image, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Text, TextInput, Button } from "react-native-paper";

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const backendUrl = "https://kite-pay-server.onrender.com";

  const handleLogin = async () => {
    if (!password || !phoneNumber) {
      Alert.alert('Error', 'Phone Number and Password are required');
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/users/login`, {
        phoneNumber,
        password,
      });

      const { token, userId } = response.data;
      if (token && userId) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", userId);
        login({ token, userId });
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        Alert.alert("Login failed", "Invalid response from server.");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response) {
        const { status, data } = error.response;
        console.log("Status:", status);
        console.log("Data:", data);
        if (status === 400) {
          Alert.alert("Login failed", data.error || "User not found.");
        } else if (status === 401) {
          Alert.alert("Login failed", data.error || "Invalid credentials.");
        } else {
          Alert.alert("Login failed", `Error: ${data.error || "Unknown error"}`);
        }
      } else if (error.request) {
        console.log("Error request:", error.request);
        Alert.alert("Login failed", "No response from server. Please try again later.");
      } else {
        console.log("Error message:", error.message);
        Alert.alert("Login failed", "An unexpected error occurred. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.image} />
        <Text variant="headlineMedium" style={styles.headerText}>
          Welcome Back!
        </Text>
        <Text variant="titleMedium" style={styles.headerText}>
          Please Login!
        </Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          right={<TextInput.Icon name={showPassword ? "eye" : "eye-off"} onPress={togglePasswordVisibility} />}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
          Login
        </Button>
        <Button mode="text" onPress={() => navigation.navigate("Registration")} style={styles.registerLink}>
          Don't have an account? <Text style={styles.registerText}>Register here</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E88E5', // Blue color
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E88E5', // Blue color
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
  },
  headerText: {
    color: '#FFFFFF', // White color
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    flex: 2,
    backgroundColor: '#EEEEEE', // Light gray
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  input: {
    marginBottom: 20,
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50', // Green color
    padding: 4 
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#1E88E5', // Blue color
  },
});

export default LoginScreen;
