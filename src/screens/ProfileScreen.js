import React, { useContext, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Text, TextInput, Button, IconButton, Avatar, Card } from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const backendUrl = "https://kite-pay-server.onrender.com"; // Your backend URL

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.userId) {
        console.error('User ID is not available.');
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/users/profile/${user.userId}`,  // Include user ID if required
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // Include the token in the Authorization header
            },
          }
        );
        setProfile(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (profilePicture) {
      const fileName = profilePicture.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append("profilePicture", {
        uri: profilePicture,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/users/profile/${user.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile(response.data);
      alert('Update Success!');
    } catch (error) {
      alert('Error updating profile:', error);
      console.error('Error updating profile:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.navigate("Home")}
      />
      <Card style={{ padding: 20 }}>
        <View style={{ alignItems: 'center' }}>
        <Text variant="headlineLarge" style={{ marginBottom: 20,  }}>User Profile</Text>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={96}
              source={{
                uri: profilePicture ? profilePicture : "https://via.placeholder.com/150",
              }}
            />
          </TouchableOpacity>
          <Text variant="bodySmall" style={{ color: '#4CAF50', marginTop: 8 }}>Tap to change profile picture</Text>
        </View>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextInput
          label="Profile Picture URL"
          value={profilePicture}
          onChangeText={setProfilePicture}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <Button mode="contained" onPress={updateProfile}>
          Update Profile
        </Button>
      </Card>
      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Button
          mode="contained"
          onPress={logout}
          buttonColor="red"
          icon={() => <AntDesign name="logout" size={20} color="white" />}
          contentStyle={{ flexDirection: 'row-reverse' }}
          labelStyle={{ color: 'white', marginLeft: 8, }}
        >
          Logout
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
