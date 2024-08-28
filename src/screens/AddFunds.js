import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { Button, TextInput, Text, Appbar, Surface } from "react-native-paper";
import axios from "axios";
import { addFunds } from "../services/walletServices";

const AddFunds = ({ route, navigation }) => {
  const userId = route?.params?.userId;
  if (!userId) {
    console.error("User ID is missing in AddFunds component");
  }

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://kite-pay-server.onrender.com/api/wallet";

  const handleAddFunds = async () => {
    if (!email || !amount) {
      Alert.alert("Error", "Please enter both email and amount.");
      return;
    }

    setLoading(true);
    try {
      const response = await addFunds(email, amount);
      if (response.success) {
        setPaymentUrl(response.authorization_url);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error Unkown:",
          error.response.data.message || "An error occurred"
        );
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No response from server. Check your network connection."
        );
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = async (navState) => {
    const url = navState.url;

    if (url.includes("reference")) {
      const reference = url.split("reference=")[1]; // Extract reference from URL
      console.log("Extracted reference:", reference);
      console.log("User ID:", userId);
      console.log("Amount:", amount);
      try {
        axios
          .post(`${API_URL}/verify`, { reference, userId, amount })
          .then((response) => {
            if (response.data.success) {
              console.log("Verification successful:", response.data);
              // Redirect to home with updated balance
              setPaymentUrl(null);
              Alert.alert("Wallet funded successfully!");
              navigation.navigate("Home", {
                balance: response.data.walletBalance,
              });
            } else {
              console.error("Verification failed:", response.data.message);
            }
          });
      } catch (error) {
        if (error.response) {
          Alert.alert(
            "Error:",
            error.response.data.message || "Transaction verification failed."
          );
        } else {
          Alert.alert("Error", "Transaction verification failed.");
        }
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Add Funds" />
      </Appbar.Header>
      <Surface style={{ flex: 1, padding: 10 }}>
        <View style={{  justifyContent: "center" }}>
          {!paymentUrl ? (
            <>
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ marginBottom: 16 }}
              />
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{ marginBottom: 24 }}
              />
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <Button
                  mode="contained"
                  onPress={handleAddFunds}
                  style={{ marginTop: 8, padding: 8 }}
                >
                  Add Funds
                </Button>
              )}
            </>
          ) : (
            <WebView
              source={{ uri: paymentUrl }}
              style={{ flex: 1 }}
              onNavigationStateChange={handleNavigationStateChange}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                Alert.alert("WebView Error", nativeEvent.description);
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator size="large" color="#0000ff" />
              )}
            />
          )}
        </View>
      </Surface>
    </SafeAreaView>
  );
};

export default AddFunds;
