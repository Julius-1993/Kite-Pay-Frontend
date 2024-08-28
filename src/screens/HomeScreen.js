import React, { useState, useEffect, useContext } from "react";
import { View, FlatList, Dimensions, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { Button, Text, Card, Avatar, IconButton } from "react-native-paper";
import { Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const HomeScreen = ({ route }) => {
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const flatListRef = React.useRef(null);

  const backendUrl = "https://kite-pay-server.onrender.com";

  // Fetch user ID from AsyncStorage on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };
    fetchUserId();
  }, []);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen, { userId });
  };

  // Fetch balance when the screen is focused or when the balance is updated
  useEffect(() => {
    if (route.params?.updatedBalance) {
      setBalance(route.params.updatedBalance);
    } else {
      fetchBalance();
    }
  }, [route.params?.updatedBalance]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/users/balance/${user.userId}`
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  // Fetch transaction history when the component mounts or when the user changes
  useEffect(() => {
    const fetchTransactionsHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/transactions/history/${user.userId}`
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (user && user.userId) {
      fetchTransactionsHistory();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (transactions.length > 0) {
        setCurrentIndex((prevIndex) => {
          const nextIndex =
            prevIndex + 1 >= transactions.length ? 0 : prevIndex + 1;
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [transactions]);

  const renderTransaction = ({ item }) => (
    <Card style={{ width: width - 40, marginHorizontal: 20, padding: 20 }}>
      <Text variant="titleMedium" style={{ marginBottom: 5 }}>
        {item.type.toUpperCase()}: &#x20A6;{item.amount.toFixed(2)}
      </Text>
      <Text>TransactionId: {item.reference}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e0f7fa" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Card style={{ margin: 10, padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar.Image
              source={{
                uri:
                  user?.profilePicture ||
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
              }}
              size={48}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text variant="titleLarge">Hello, {user?.name || "Guest"}!</Text>
            </View>
            <IconButton
              icon="bell"
              iconColor="red"
              size={24}
              onPress={() => console.log("Notification pressed")}
            />
            <IconButton
              icon="headset"
              iconColor="green"
              size={24}
              onPress={() => console.log("Support pressed")}
            />
          </View>
        </Card>

        <Card style={{ margin: 10, padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text variant="headlineSmall">
              Balance: &#x20A6;{balance.toFixed(2)}
            </Text>
            <Button
              mode="text"
              onPress={() => navigateToScreen("TransactionHistory")}
            >
              Transaction History
              <AntDesign name="right" size={14} color="black" />
            </Button>
          </View>
        </Card>

        <Card style={{ margin: 10, padding: 40 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button
              mode="elevated"
              icon="bank"
              onPress={() => navigateToScreen("AddFunds")}
              style={{ width: "38%", height: "100%", marginRight: 60 }}
            >
              Add Funds
            </Button>
            <Button
              mode="elevated"
              icon="swap-horizontal"
              onPress={() => navigateToScreen("TransferFunds")}
              style={{ width: "38%", height: "100%", marginRight: 60 }}
            >
              Transfer Funds
            </Button>
          </View>
        </Card>

        <Card style={{ margin: 10, padding: 10 }}>
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>
            Recent Transactions
          </Text>
          <FlatList
            ref={flatListRef}
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={renderTransaction}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={() => {}}
          />
        </Card>

        <Card style={{ margin: 10, padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ alignItems: "center", width: "28%", marginBottom: 10 }}
            >
              <Ionicons
                name="wifi"
                size={32}
                color="#1E90FF"
                style={{ marginBottom: 5 }}
              />
              <Button
                mode="contained"
                onPress={() => navigateToScreen("Airtime")}
              >
                Airtime
              </Button>
            </View>
            <View
              style={{ alignItems: "center", width: "28%", marginBottom: 10 }}
            >
              <FontAwesome
                name="tv"
                size={32}
                color="#32CD32"
                style={{ marginBottom: 5 }}
              />
              <Button
                mode="contained"
                onPress={() => navigateToScreen("Games")}
              >
                TV
              </Button>
            </View>
            <View
              style={{
                alignItems: "center",
                width: "28%",
                marginBottom: 10,
                padding: 4,
              }}
            >
              <FontAwesome
                name="soccer-ball-o"
                size={32}
                color="black"
                style={{ marginBottom: 5 }}
              />
              <Button
                mode="contained"
                onPress={() => navigateToScreen("BettingFunds")}
              >
                Bet
              </Button>
            </View>
            <View
              style={{ alignItems: "center", width: "28%", marginBottom: 10 }}
            >
              <Ionicons
                name="flash"
                size={32}
                color="orange"
                style={{ marginBottom: 5 }}
              />
              <Button
                mode="contained"
                onPress={() => navigateToScreen("UtilityBills")}
              >
                Utility
              </Button>
            </View>
            <View
              style={{ alignItems: "center", width: "38%", marginBottom: 10 }}
            >
              <AntDesign
                name="qrcode"
                size={32}
                color="#8A2BE2"
                style={{ marginBottom: 5 }}
              />
              <Button
                mode="contained"
                onPress={() => navigateToScreen("QrCode")}
                style={{ alignItems: "center", width: "40%" }}
              >
                QR
              </Button>
            </View>
            <View
              style={{ alignItems: "center", width: "28%", marginBottom: 10 }}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={32}
                color="#FF69B4"
                style={{ marginBottom: 5 }}
              />
              <Button mode="contained" onPress={() => navigateToScreen("More")}>
                More
              </Button>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
