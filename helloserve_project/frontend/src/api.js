const API_BASE = "http://localhost:8081/api";

export const api = {
  spaces: {
    getAvailable: async () => {
      const res = await fetch(`${API_BASE}/spaces/available`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    getAll: async () => {
      const res = await fetch(`${API_BASE}/spaces`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    }
  },
  users: {
    register: async (u) => {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(u)
      });
      return res.json();
    },
    login: async (c) => {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(c)
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    }
  },
  bookings: {
    create: async (b) => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(b)
      });
      if (!res.ok) throw new Error('Booking failed');
      return res.json();
    },
    getByUser: async (userId) => {
      const res = await fetch(`${API_BASE}/bookings/user/${userId}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    }
  }
};
