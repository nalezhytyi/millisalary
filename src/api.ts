const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export const fetchExchangeRate = async (fromCurrency: string, toCurrency: string): Promise<number> => {
  try {
    const response = await fetch(`${EXCHANGE_RATE_API_URL}${fromCurrency}`);
    // fetch only rejects on network errors; treat 4xx/5xx as failures too
    if (!response.ok) {
      throw new Error(`Exchange rate request failed with ${response.status}`);
    }
    const data = await response.json();
    return data.rates[toCurrency];
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
};