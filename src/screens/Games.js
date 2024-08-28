import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, RadioButton, Divider,  Appbar } from 'react-native-paper';


const Games = ({route, navigation}) => {
  const [selectedPackage, setSelectedPackage] = useState('');

  const subscriptionOptions = [
    { label: 'DStv Compact', value: 'dstv_compact', price: '₦7,900' },
    { label: 'DStv Premium', value: 'dstv_premium', price: '₦16,200' },
    { label: 'GOtv Max', value: 'gotv_max', price: '₦4,150' },
    { label: 'GOtv Jolli', value: 'gotv_jolli', price: '₦2,460' },
  ];

  const handlePayment = () => {
    if (selectedPackage) {
      // Proceed with the payment process for the selected package
      console.log(`Selected package: ${selectedPackage}`);
      // Code to handle payment
    } else {
      alert('Please select a subscription package');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{marginVertical: 10}}>
      <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Satellite Dish Subscription" />
      </Appbar.Header>
      
      {subscriptionOptions.map((option) => (
        <Card key={option.value} style={styles.card}>
          <Card.Content>
            <View style={styles.radioContainer}>
              <RadioButton
                value={option.value}
                status={selectedPackage === option.value ? 'checked' : 'unchecked'}
                onPress={() => setSelectedPackage(option.value)}
              />
              <View style={styles.packageInfo}>
                <Text style={styles.packageLabel}>{option.label}</Text>
                <Text style={styles.packagePrice}>{option.price}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        onPress={handlePayment}
        style={styles.button}
        disabled={!selectedPackage}
      >
        Proceed to Payment
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageInfo: {
    marginLeft: 10,
  },
  packageLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 16,
    color: '#777',
  },
  divider: {
    marginVertical: 20,
  },
  button: {
    padding: 8,
  },
});

export default Games;
