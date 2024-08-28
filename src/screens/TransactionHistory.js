import React, { useEffect, useState, useContext } from "react";
import { View, FlatList } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { Card, Text, Button } from "react-native-paper";

const TransactionHistory = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const { user } = useContext(AuthContext);

  const backendUrl = "https://kite-pay-server.onrender.com";

  useEffect(() => {
    const fetchTransactionsHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/transactions/history/${user.userId}`
        );
        setTransactions(response.data.transactions); // Ensure response data is structured correctly
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (user && user.userId) {
      fetchTransactionsHistory();
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e0f7fa" }}>
      <Card style={{ margin: 10, padding: 10 }}>
        <View style={{ alignContent: "center", padding: 8 }}>
          <Text variant="titleLarge">Transaction History</Text>
        </View>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <Text>Amount:{' '} &#x20A6;{item.amount.toFixed(2)}
              </Text>
              <Text>TransactionId:{' '} {item.reference}</Text>
              <Text>Type:
              {' '} {item.type.toUpperCase()}
              </Text>
              <Text>Date:{' '} {new Date(item.date).toLocaleDateString()}</Text>
            </View>
          )}
        />
        <Button mode="contained" onPress={() => navigation.navigate('Home')}>
          Go Back
        </Button>
      </Card>
    </SafeAreaView>
  );
};

export default TransactionHistory;
