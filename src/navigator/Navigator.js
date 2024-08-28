import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import LoginScreen from "../screens/LoginScreen";
import Airtime from "../screens/Airtime";
import UtilityBills from "../screens/UtilityBills";
import BettingFunds from "../screens/BettingFunds";
import QrCode from "../screens/QrCode";
import Games from "../screens/Games";
import WelcomeScreen from "../screens/WelcomeScreen";
import { AuthContext } from "../context/AuthContext";
import TransactionHistory from "../screens/TransactionHistory";
import Transaction from "../screens/Transaction";
import AddFunds from "../screens/AddFunds";
import ProfileScreen from "../screens/ProfileScreen";

const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Registration" component={RegistrationScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Airtime" component={Airtime} options={{ headerShown: false }} />
      <Drawer.Screen name="UtilityBills" component={UtilityBills} options={{ headerShown: false }} />
      <Drawer.Screen name="BettingFunds" component={BettingFunds} options={{ headerShown: false }} />
      <Drawer.Screen name="Games" component={Games} options={{ headerShown: false }} />
      <Drawer.Screen name="QrCode" component={QrCode} options={{ headerShown: false }} />
      <Drawer.Screen name="TransactionHistory" component={TransactionHistory} options={{ headerShown: false }} />
      <Drawer.Screen name="TransferFunds" component={Transaction} options={{ headerShown: false }} />
      <Drawer.Screen name="AddFunds" component={AddFunds} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};

const Navigator = () => {
  const { user } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthNavigator />  }
    </NavigationContainer>
  );
};

export default Navigator;