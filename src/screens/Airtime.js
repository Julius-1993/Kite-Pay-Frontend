import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { TextInput, Button, Appbar, Menu, Provider } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import api from '../utils/api';

const Airtime = ({ route, navigation }) => {
  const { userId } = route?.params?.userId || '';
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [networkProvider, setNetworkProvider] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const purchaseAirtime = async () => {
    try {
      const response = await api.post('/transactions/purchaseAirtime', {
        userId,
        amount,
        phoneNumber,
        networkProvider,
      });
      alert('Airtime purchased');
      setAmount('');
      setPhoneNumber('');
      setNetworkProvider('');
    } catch (error) {
      console.error(error);
      alert('Airtime purchase failed');
    }
  };

  return (
    <Provider>
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
          <Appbar.Content title="Purchase Airtime" />
        </Appbar.Header>

        <View style={{ padding: 16 }}>
          <TextInput
            label="Phone Number"
            mode="outlined"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
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

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TextInput
                label="Network Provider"
                mode="outlined"
                value={networkProvider}
                onFocus={() => setMenuVisible(true)}
                right={<TextInput.Icon name="menu-down" />}
                style={{ marginBottom: 16 }}
              />
            }
          >
            <Menu.Item onPress={() => { setNetworkProvider('MTN'); setMenuVisible(false); }} title="MTN" />
            <Menu.Item onPress={() => { setNetworkProvider('Airtel'); setMenuVisible(false); }} title="Airtel" />
            <Menu.Item onPress={() => { setNetworkProvider('Glo'); setMenuVisible(false); }} title="Glo" />
            <Menu.Item onPress={() => { setNetworkProvider('9mobile'); setMenuVisible(false); }} title="9mobile" />
          </Menu>

          <Button mode="contained" onPress={purchaseAirtime}>
            Purchase Airtime
          </Button>
        </View>
      </SafeAreaView>
    </Provider>
  );
};

export default Airtime;
