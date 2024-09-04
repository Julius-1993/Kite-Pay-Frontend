import React, { useEffect, useState, useContext } from "react";
import { View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { Card, Text, Button, SegmentedButtons } from "react-native-paper";

const TransactionHistory = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [transactionType, setTransactionType] = useState("credit");
  const { user } = useContext(AuthContext);

  const backendUrl = "https://kite-pay-server.onrender.com";

  // Fetch transactions based on type and page number
  const fetchTransactionsHistory = async (type, page, isRefreshing = false) => {
    if (!isRefreshing) setLoading(false);
    try {
      // Fetch all transactions but filter them based on the type selected
      const response = await axios.get(
        `${backendUrl}/api/transactions/history/${user.userId}?page=${page}&limit=10`
      );

      // Filter transactions to ensure they match the selected type
      const filteredTransactions = response.data.transactions.filter(
        (transaction) => transaction.type.toLowerCase() === type
      );

      // Append new transactions to the existing ones or replace them if refreshing
      setTransactions((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newTransactions = filteredTransactions.filter(
          (item) => !existingIds.has(item._id)
        );
        return isRefreshing ? filteredTransactions : [...prev, ...newTransactions];
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch transactions when user or transaction type changes
  useEffect(() => {
    if (user && user.userId) {
      setTransactions([]); // Clear transactions on type switch
      setPage(1); // Reset page on type switch
      fetchTransactionsHistory(transactionType, 1);
    }
  }, [user, transactionType]);

  // Load more transactions when scrolled to the bottom
  const loadMoreTransactions = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTransactionsHistory(transactionType, nextPage);
    }
  };

  // Handle refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchTransactionsHistory(transactionType, 1, true);
  };

  // Render each transaction item
  const renderTransactionItem = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text>Amount: &#x20A6;{item.amount.toFixed(2)}</Text>
      <Text>TransactionId: {item.reference}</Text>
      <Text>Type: {item.type.toUpperCase()}</Text>
      <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  // Render empty state when no transactions are available
  const renderEmptyComponent = () => (
    <Text style={{ textAlign: "center", marginTop: 20 }}>No transactions found.</Text>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e0f7fa" }}>
      <View>
        <SegmentedButtons
          value={transactionType}
          onValueChange={setTransactionType}
          buttons={[
            { value: "credit", label: "Receive" },
            { value: "debit", label: "Transfer" },
          ]}
          style={{ margin: 10 }}
        />
      </View>
      <Card style={{ flex: 1, margin: 10, padding: 10 }}>
        <View style={{ alignContent: "center", padding: 8 }}>
          <Text variant="titleLarge">Transaction History</Text>
        </View>
        <FlatList
          data={transactions}
          keyExtractor={(item) => `${item._id}-${item.reference}`} // Ensure a unique key by combining fields
          renderItem={renderTransactionItem}
          onEndReached={loadMoreTransactions}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={
            loading && !refreshing ? (
              <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 20 }} />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#0000ff"]} />
          }
        />
        <Button mode="contained" onPress={() => navigation.navigate("Home")}>
          Go Back
        </Button>
      </Card>
    </SafeAreaView>
  );
};

export default TransactionHistory;
