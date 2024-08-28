import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");

  useEffect(() =>{
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if(storedUser){
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);
  
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/refresh-token`, {
        refreshToken: user.refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      const updatedUser = { ...user, token: newAccessToken };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      // Handle token refresh failure (e.g., force logout)
    }
  };




  const login = async (userData) => {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      };
    
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, logout, setUser, login, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};