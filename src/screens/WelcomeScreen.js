import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Alert } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {

  const handlePress = () => {
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.surface}>
        <Image source={require('../../assets/icon.png')} style={styles.image} />
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Welcome to <Text style={styles.brandText}>Kite-Pay</Text>
        </Text>
        <Text variant="titleMedium" style={styles.subtitleText}>
          A friendly User App
        </Text>
        <Text variant="titleMedium" style={styles.subtitleText}>
          with secure and seamless transactions
        </Text>
        <Text variant="titleMedium" style={styles.subtitleText}>
          Your satisfaction is our priority
        </Text>
      </Surface>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handlePress}
          style={styles.button}
        >
          Let's get started
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E88E5', // Blue color
  },
  surface: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    elevation: 4,
    backgroundColor: '#1E88E5', // Blue color
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  welcomeText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 28,
    paddingVertical: 10,
  },
  brandText: {
    color: '#FFFFFF', // White color
  },
  subtitleText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE', // Light gray
    paddingVertical: 40,
  },
  button: {
    backgroundColor: '#4CAF50', // Green color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});

export default WelcomeScreen;