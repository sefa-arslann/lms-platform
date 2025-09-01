import { useState, useCallback } from 'react';
import { ordersApi, CreateOrderRequest, Order, OrderStats } from '../utils/api/orders';
import { useAuth } from '../contexts/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Create a new order
  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<Order | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const order = await ordersApi.createOrder(data);
      
      // Add new order to the list
      setOrders(prev => [order, ...prev]);
      
      return order;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create order';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch user orders
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const userOrders = await ordersApi.getUserOrders();
      setOrders(userOrders);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch order statistics
  const fetchOrderStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const orderStats = await ordersApi.getOrderStats();
      setStats(orderStats);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get order by ID
  const getOrder = useCallback(async (id: string): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const order = await ordersApi.getOrder(id);
      return order;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    stats,
    loading,
    error,
    createOrder,
    fetchUserOrders,
    fetchOrderStats,
    getOrder,
    clearError,
  };
};
