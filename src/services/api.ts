import { Order, MenuItem, OrderStatus, PaymentConfig, Table } from '../types';

/**
 * PRODUCTION API SERVICE
 * Connects the Frontend to the Node.js Server
 */

const API_BASE = '/api';

export const BeeHiveAPI = {
  // --- INITIAL DATA ---
  async getInitData(): Promise<{ 
    orders: Order[], 
    menu: MenuItem[], 
    categories: string[], 
    tables: Table[], 
    paymentConfig: PaymentConfig 
  }> {
    const res = await fetch(`${API_BASE}/init`);
    return res.json();
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  async createOrder(orderData: any): Promise<any> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // --- MENU ---
  async getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menu`);
    return res.json();
  },

  async saveMenuItem(item: MenuItem): Promise<void> {
    await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  },

  async deleteMenuItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE'
    });
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async addCategory(category: string): Promise<void> {
    await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category })
    });
  },

  // --- SETTINGS & TABLES ---
  async getPaymentConfig(): Promise<PaymentConfig> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updatePaymentConfig(config: PaymentConfig): Promise<void> {
    await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
  },

  async getTables(): Promise<Table[]> {
    const res = await fetch(`${API_BASE}/tables`);
    const data = await res.json();
    return data;
  },

  async updateTableStatus(tableId: string, isOccupied: boolean): Promise<void> {
    await fetch(`${API_BASE}/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOccupied })
    });
  }
};
