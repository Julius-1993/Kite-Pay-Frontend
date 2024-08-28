import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Text, TextInput, Button, Appbar, Surface } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';

const QrCode = ({ route, navigation }) => {
  const { userId } = route?.params?.userId || '';
  const [receiverPhone, setReceiverPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [qrValue, setQrValue] = useState('');

  const backendUrl = 'http://192.168.1.107:3000';

  const generateQrCode = () => {
    const transferData = {
      sender: userId,
      receiverPhone,
      amount,
      pin,
    };
    setQrValue(JSON.stringify(transferData));
  };

  const scanQrCode = async (qrValue) => {
    const transferData = JSON.parse(qrValue);
    try {
      const response = await axios.post(`${backendUrl}/api/transactions/qrTransfer`, {
        userId: transferData.sender,
        amount: transferData.amount,
        transactionPin: transferData.pin,
      });
      Alert.alert('Transfer successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Generate QR Code" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16 }}>
        <TextInput
          label="Receiver Phone"
          mode="outlined"
          value={receiverPhone}
          onChangeText={setReceiverPhone}
          keyboardType="numeric"
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
        <TextInput
          label="Transaction PIN"
          mode="outlined"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          style={{ marginBottom: 24 }}
        />
        <Button
          mode="contained"
          onPress={generateQrCode}
          style={{ marginBottom: 16 }}
        >
          Generate QR Code
        </Button>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          {qrValue ? <QRCode value={qrValue} size={250} /> : null}
        </View>
      </Surface>
    </View>
  );
};

export default QrCode;
