import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const UtilityBills = ({ route, navigation }) => {
  const { userId } = route.params;
  const [amount, setAmount] = useState("");
  const [utilityType, setUtilityType] = useState("");

  const payUtilityBill = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/transactions/payUtilityBill",
        {
          userId,
          amount,
          utilityType,
        }
      );
      alert("Utility bill paid");
      setAmount("");
      setUtilityType("");
    } catch (error) {
      console.error(error);
      alert("Utility bill payment failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.navigate("Home")}
      />
      <View style={{ flex: 1, padding: 16, alignContent: "center" }}>
        <TextInput
          placeholder="Utility Type"
          value={utilityType}
          onChangeText={setUtilityType}
        />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button mode="contained" onPress={payUtilityBill} style={styles.loginButton} >
        Pay Utility Bill
          </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  loginButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50', // Green color
    padding: 4 
  }
});

export default UtilityBills;
