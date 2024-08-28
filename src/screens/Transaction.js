import React, { useState, useEffect } from "react";
import { Alert, View, SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, Text, TextInput, Appbar, Surface } from "react-native-paper";
import axios from "axios";
import {
  transferFunds,
  fetchBankList,
  getAccountName,
  saveRecipient,
} from "../services/walletServices";

const Transaction = ({ route, navigation }) => {
  const { userId } = route?.params || "";
  const [accountNumber, setAccountNumber] = useState("");
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [pin, setPin] = useState("");
  const [transactionSuccessful, setTransactionSuccessful] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetchBankList();
        setBankList(response.banks);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch bank list.");
        console.log("Error", "Failed to fetch bank list.");
      }
    };
    fetchBanks();
  }, []);

  const handleAccountNameFetch = async () => {
    try {
      if (!selectedBank) {
        Alert.alert("Error", "Please select a bank.");
        return;
      }

      const accountResponse = await getAccountName({
        account_number: accountNumber,
        bank_code: selectedBank,
      });
      
      if (accountResponse.success) {
        setRecipientName(accountResponse.accountName);
      } else {
        Alert.alert("Error", "Unable to resolve account name.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch account name.");
      console.error("Error fetching account name:", error.message);
    }
  };

  const handleTransferFunds = async () => {
    try {
      const response = await transferFunds({
        amount,
        account_number: accountNumber,
        bank_code: selectedBank,
        reason,
        userId,
        pin,
      });

      if (response.success) {
        setTransactionSuccessful(true);
        Alert.alert("Success", "Funds transferred successfully.");
        navigation.navigate("Home", {
          updatedBalance: response.updatedBalance,
        });
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error during fund transfer:", error.message);
    }
  };

  const handleSaveRecipient = async () => {
    try {
      const response = await saveRecipient({
        name: recipientName,
        account_number: accountNumber,
        bank_code: selectedBank,
      });

      if (response.success) {
        Alert.alert("Success", "Recipient saved successfully.");
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Error saving recipient:", error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Transaction" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            label="Account Number"
            mode="outlined"
            value={accountNumber}
            onChangeText={setAccountNumber}
            onBlur={handleAccountNameFetch}
            style={{ marginBottom: 16 }}
            keyboardType="numeric"
          />

          <Picker
            selectedValue={selectedBank}
            onValueChange={(itemValue) => {
              setSelectedBank(itemValue);
              setRecipientName("");  // Clear recipient name on bank change
            }}
            style={{ marginBottom: 16 }}
          >
            <Picker.Item label="Select Bank" value="" />
            {bankList.map((bank) => (
              <Picker.Item
                key={bank.code}
                label={bank.name}
                value={bank.code}
              />
            ))}
          </Picker>

          {recipientName ? (
            <Text style={{ marginBottom: 16 }}>
              Account Name: {recipientName}
            </Text>
          ) : null}

          <TextInput
            label="Amount"
            mode="outlined"
            value={amount}
            onChangeText={setAmount}
            style={{ marginBottom: 16 }}
            keyboardType="numeric"
          />

          <TextInput
            label="Reason"
            mode="outlined"
            value={reason}
            onChangeText={setReason}
            style={{ marginBottom: 16 }}
          />

          <TextInput
            label="Enter PIN"
            mode="outlined"
            value={pin}
            keyboardType="numeric"
            onChangeText={setPin}
            secureTextEntry
            style={{ marginBottom: 24 }}
          />

          <Button
            mode="contained"
            onPress={handleTransferFunds}
            style={{ marginBottom: 16, padding: 4 }}
          >
            Transfer Money
          </Button>

          {transactionSuccessful && (
            <Button
              mode="contained"
              onPress={handleSaveRecipient}
              color="green"
            >
              Save Recipient
            </Button>
          )}
        </View>
      </Surface>
    </SafeAreaView>
  );
};

export default Transaction;
