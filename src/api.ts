import axios from 'axios';

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  try {
    const response = await axios.get(`${EXCHANGE_RATE_API_URL}${fromCurrency}`);
    return response.data.rates[toCurrency];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};