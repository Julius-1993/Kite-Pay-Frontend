import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { TextInput, Button, Text, Appbar, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserSettings = ({ route, navigation }) => {
  const { userId } = route?.params?.userId || '';
  const [newPassword, setNewPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const backendUrl = "http://192.168.1.107:3000";

  const updatePassword = async () => {
    try {
      await axios.post(`${backendUrl}/api/users/updatePassword`, {
        userId,
        newPassword,
      });
      alert("Password updated");
    } catch (error) {
      console.error(error);
    }
  };

  const updatePin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put(`${backendUrl}/api/users/updatePin`, {
        userId,
        newPin,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      alert("Transaction PIN updated");
    } catch (error) {
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title="User Settings" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <TextInput
          label="New Password"
          mode="outlined"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              name={showPassword ? "eye" : "eye-off"}
              onPress={togglePasswordVisibility}
            />
          }
          style={{ marginBottom: 16 }}
        />

        <Button
          mode="contained"
          onPress={updatePassword}
          style={{ marginBottom: 24, padding: 4 }}
        >
          Update Password
        </Button>

        <TextInput
          label="New Transaction PIN"
          mode="outlined"
          value={newPin}
          onChangeText={setNewPin}
          secureTextEntry={!showPin}
          right={
            <TextInput.Icon
              name={showPin ? "eye" : "eye-off"}
              onPress={togglePinVisibility}
            />
          }
          style={{ marginBottom: 16 }}
        />

        <Button
          mode="contained"
          onPress={updatePin}
          style={{ marginBottom: 24, padding: 4}}
        >
          Update Transaction PIN
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default UserSettings;
