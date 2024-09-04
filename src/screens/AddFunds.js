import React, { useState } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Button, TextInput, Appbar, Surface } from "react-native-paper";
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
      console.log("Add Funds Response:", response);
      if (response.success) {
        setPaymentUrl(response.authorization_url);
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("Add Funds Error:", error);
      if (error.response) {
        Alert.alert(
          "Error:",
          error.response.data.message || "An error occurred while adding funds."
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
      const reference = url.split("reference=")[1];
      console.log("Extracted reference:", reference);
      console.log("User ID:", userId);
      console.log("Amount:", amount);

      try {
        // Ensure correct data types before sending the request
        const validAmount = parseFloat(amount);
        if (isNaN(validAmount)) {
          Alert.alert("Error", "Invalid amount. Please enter a valid number.");
          return;
        }

        // Post data to backend for verification
        const response = await axios.post(`${API_URL}/verify`, {
          reference,
          userId,
          amount: validAmount,
        });
        console.log("Verification response:", response.data);

        if (response.data.success) {
          console.log("Verification successful:", response.data);
          setPaymentUrl(null);
          Alert.alert("Wallet funded successfully!");
          navigation.navigate("Home", {
            balance: response.data.walletBalance,
          });
        } else {
          console.error("Verification failed:", response.data.message);
          Alert.alert("Verification Error", response.data.message);
        }
      } catch (error) {
        console.error("Verification Error:", error);
        if (error.response) {
          console.log("Response Data:", error.response.data);
          Alert.alert(
            "Error:",
            error.response.data.message || "Transaction verification failed."
          );
        } else if (error.request) {
          Alert.alert(
            "Error",
            "No response from server. Check your network connection."
          );
        } else {
          Alert.alert("Error", "Transaction verification failed.");
        }
      }
    }
  };

  const handleCancelPayment = () => {
    setPaymentUrl(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title="Add Funds" />
      </Appbar.Header>
      <Surface style={{ flex: 1, padding: 10 }}>
        <View style={{ justifyContent: "center", flex: 1 }}>
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
            <>
              <WebView
                source={{ uri: paymentUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleNavigationStateChange}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  Alert.alert("WebView Error", nativeEvent.description);
                  console.error("WebView Error:", nativeEvent);
                }}
                startInLoadingState={true}
                renderLoading={() => (
                  <ActivityIndicator size="large" color="#0000ff" />
                )}
              />
              <Button
                mode="outlined"
                onPress={handleCancelPayment}
                style={{ marginTop: 16, padding: 8 }}
              >
                Cancel Payment
              </Button>
            </>
          )}
        </View>
      </Surface>
    </SafeAreaView>
  );
};

export default AddFunds;
