import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import axios from 'axios';

const BettingFunds = ({ route, navigation }) => {
  const userId = route?.params?.userId || '';
  const [amount, setAmount] = useState('');
  const [betType, setBetType] = useState('');

  const fundBettingAccount = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/transactions/bettingFunds', {
        userId,
        amount,
        betType,
      });
      alert('Betting funds transferred');
      setAmount('');
      setBetType('');
    } catch (error) {
      console.error(error);
      alert('Betting funds transfer failed');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Fund Betting Account" />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <TextInput
          label="Bet Type"
          mode="outlined"
          value={betType}
          onChangeText={setBetType}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Amount"
          mode="outlined"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={{ marginBottom: 16 }}
        />

        <Button mode="contained" onPress={fundBettingAccount} style={{ padding: 4 }}>
          Fund Betting Account
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default BettingFunds;
