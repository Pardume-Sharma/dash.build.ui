'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useApi() {
  const { getToken } = useAuth();

  const makeRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = await getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add temporary user identification for API tokens
    // In production, this would be extracted from the JWT token
    headers['x-clerk-user-id'] = 'test_123';

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }, [getToken]);

  const api = {
    get: useCallback(<T>(endpoint: string): Promise<T> => {
      return makeRequest(endpoint, { method: 'GET' });
    }, [makeRequest]),

    post: useCallback(<T>(endpoint: string, data: any): Promise<T> => {
      return makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }, [makeRequest]),

    patch: useCallback(<T>(endpoint: string, data: any): Promise<T> => {
      return makeRequest(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }, [makeRequest]),

    put: useCallback(<T>(endpoint: string, data: any): Promise<T> => {
      return makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }, [makeRequest]),

    delete: useCallback(<T>(endpoint: string): Promise<T> => {
      return makeRequest(endpoint, { method: 'DELETE' });
    }, [makeRequest]),
  };

  return api;
}