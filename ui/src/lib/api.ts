const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  async get<T>(endpoint: string, options?: { token?: string }): Promise<T> {
    const headers: HeadersInit = {};
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async post<T>(endpoint: string, data: any, options?: { token?: string }): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      const errorMessage = result.error?.message || result.message || `API Error: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return result;
  },

  async patch<T>(endpoint: string, data: any, options?: { token?: string }): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async delete<T>(endpoint: string, options?: { token?: string }): Promise<T> {
    const headers: HeadersInit = {};
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },

  async put<T>(endpoint: string, data: any, options?: { token?: string }): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
