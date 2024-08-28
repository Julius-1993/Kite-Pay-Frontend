import axios from 'axios';

const API_URL = 'https://kite-pay-server.onrender.com/api/wallet';

export const addFunds = async (email, amount) => {
    const response = await axios.post(`${API_URL}/add-funds`, { email, amount });
    return response.data;
};

// Fetch bank details based on the account number
export const fetchBankList = async () => {
  try {
    const response = await axios.get(`${API_URL}/fetch-bank-list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bank list:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch the account holder's name based on account number and bank code
export const getAccountName = async ({ account_number, bank_code }) => {
  try {
    const response = await axios.post(`${API_URL}/get-account-name`, { account_number, bank_code });
    return response.data;
  } catch (error) {
    console.error("Error fetching account name:", error.response?.data || error.message);
    throw error;
  }
};

// Save the recipient's details for future transactions
export const saveRecipient = async ({ name, account_number, bank_name }) => {
  try {
    const response = await axios.post(`${API_URL}/save-recipient`, { name, account_number, bank_name });
    return response.data;
  } catch (error) {
    console.error("Error saving recipient:", error.response?.data || error.message);
    throw error;
  }
};

// Transfer funds to the specified recipient
export const transferFunds = async ({ amount, account_number, bank_code, reason, userId, pin }) => {
  try {
    const response = await axios.post(`${API_URL}/transfer-funds`, { amount, account_number, bank_code, reason, userId, pin });
    return response.data;
  } catch (error) {
    console.error("Error transferring funds:", error.response?.data || error.message);
    throw error;
  }
};

