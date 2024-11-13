const BASE_URL = "https://api.coincap.io/v2";
const API_KEY = "cd13a4b2-bf09-4b5d-a31d-ed8b62ea1de3";

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Accept-Encoding': 'gzip',
  'Accept': 'application/json'
};

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const fetchTopCryptos = async (): Promise<any> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/assets?limit=50`);
    return data.data;
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return [];
  }
};

export const fetchTrendingCryptos = async (showLosers: boolean = false): Promise<any> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/assets?limit=100`);
    const sortedData = data.data.sort((a: any, b: any) => 
      showLosers 
        ? parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr)
        : parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr)
    ).slice(0, 50);
    return sortedData;
  } catch (error) {
    console.error('Error fetching trending cryptos:', error);
    return [];
  }
};

export const fetchCryptoDetails = async (id: string): Promise<any> => {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/assets/${id}`);
    return data.data;
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    return null;
  }
};

export type TimeInterval = "d1" | "d5" | "m1" | "m3" | "y1" | "y5" | "all";

export const fetchCryptoHistory = async (id: string, interval: TimeInterval): Promise<any> => {
  const now = Date.now();
  const getStartTime = () => {
    switch (interval) {
      case "d1": return now - 24 * 60 * 60 * 1000;
      case "d5": return now - 5 * 24 * 60 * 60 * 1000;
      case "m1": return now - 30 * 24 * 60 * 60 * 1000;
      case "m3": return now - 90 * 24 * 60 * 60 * 1000;
      case "y1": return now - 365 * 24 * 60 * 60 * 1000;
      case "y5": return now - 5 * 365 * 24 * 60 * 60 * 1000;
      case "all": return now - 11 * 365 * 24 * 60 * 60 * 1000;
    }
  };

  const getApiInterval = () => {
    switch (interval) {
      case "d1": return "m5";
      case "d5": return "h1";
      case "m1": return "h6";
      case "m3": return "d1";
      case "y1": return "d1";
      case "y5": return "d1";
      case "all": return "d1";
    }
  };

  const startTime = getStartTime();
  const apiInterval = getApiInterval();

  try {
    const data = await fetchWithRetry(
      `${BASE_URL}/assets/${id}/history?interval=${apiInterval}&start=${startTime}&end=${now}`
    );
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid data format received:', data);
      return [];
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return [];
  }
};