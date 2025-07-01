const API_BASE_URL = 'http://localhost:8001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('🌐 Making API request to:', url);
    console.log('📋 Request config:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body) : undefined
    });

    try {
      const response = await fetch(url, config);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Response error data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Response data:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('🔗 Request URL:', url);
      console.error('⚙️ Request config:', config);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Test connection method
  async testConnection() {
    try {
      const response = await this.get('/');
      return response;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw error;
    }
  }
}

export default new ApiService(); 