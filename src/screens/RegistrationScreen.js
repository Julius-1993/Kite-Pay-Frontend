import { useState } from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TextInput, Button, Text, Surface, useTheme } from "react-native-paper";

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const theme = useTheme();

  const backendUrl = "https://kite-pay-server.onrender.com";

  const register = async () => {
    if (!name || !email || !password || !phoneNumber) {
      alert('Error', 'All fields are required');
      return;
    }
    try {
      await axios.post(`${backendUrl}/api/users/register`, {
        name,
        email,
        password,
        phoneNumber,
      });
      alert("Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Surface style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
            Register here!
          </Text>
        </View>
        <TextInput
          mode="outlined"
          label="Full Name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 16 }}
        />
        <TextInput
          mode="outlined"
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 16 }}
        />
        <TextInput
          mode="outlined"
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          style={{ marginBottom: 16 }}
        />
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{ marginBottom: 16 }}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={togglePasswordVisibility}
            />
          }
        />
        <Button
          mode="contained"
          onPress={register}
          style={{ marginVertical: 10, padding: 4 }}
        >
          Register
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: theme.colors.primary }}>
            Already have an account? <Text style={{ fontWeight: 'bold' }}>Login here</Text>
          </Text>
        </TouchableOpacity>
      </Surface>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
