import { apiClient } from './client';
import SecureStorage from '@/utils/secureStorage';

export interface CreateOrderRequest {
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
  metadata?: Record<string, any>;
}

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE';
  paymentIntentId?: string;
  invoiceNumber?: string;
  purchasedAt: string;
  expiresAt?: string; // Kurs erişim bitiş tarihi
  metadata?: Record<string, any>;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  successRate: number;
}

class OrdersApi {
  private baseUrl = 'http://localhost:3001/orders';

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    // Get auth token from SecureStorage
    const token = SecureStorage.getToken();
    
    console.log('🔐 Token check:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...'
    });
    
    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }
    
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await fetch(`${this.baseUrl}/user/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user orders');
    }

    return response.json();
  }

  async getOrder(id: string): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return response.json();
  }

  async getOrderStats(): Promise<OrderStats> {
    const response = await fetch(`${this.baseUrl}/stats`);

    if (!response.ok) {
      throw new Error('Failed to fetch order stats');
    }

    return response.json();
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return response.json();
  }
}

export const ordersApi = new OrdersApi();
