import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

export const authService = {
  async signup(name: string, email: string, password: string) {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  },

  async signin(email: string, password: string) {
    const response = await axios.post(`${API_URL}/signin`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },
};
