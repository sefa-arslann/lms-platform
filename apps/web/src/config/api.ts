export const API_CONFIG = {
  // Development
  development: {
    baseUrl: 'http://localhost:3003',
    wsUrl: 'http://localhost:3003',
  },
  // Production
  production: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.lmsplatform.com',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.lmsplatform.com',
  },
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export const API_BASE_URL = config.baseUrl;
export const WS_BASE_URL = config.wsUrl;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  
  // Admin
  admin: {
    dashboard: `${API_BASE_URL}/admin/dashboard`,
    users: `${API_BASE_URL}/admin/users`,
    courses: `${API_BASE_URL}/admin/courses`,
    devices: `${API_BASE_URL}/admin/devices`,
    stats: {
      users: `${API_BASE_URL}/admin/users/stats`,
      courses: `${API_BASE_URL}/admin/users/stats`,
      devices: `${API_BASE_URL}/admin/devices/stats`,
    },
  },
  
  // CMS & Settings
  cms: {
    settings: `${API_BASE_URL}/cms/admin/settings`,
  },
  
  // Users
  users: {
    list: `${API_BASE_URL}/users`,
    profile: `${API_BASE_URL}/users/profile`,
    byId: (id: string) => `${API_BASE_URL}/users/${id}`,
    byRole: (role: string) => `${API_BASE_URL}/users/role/${role}`,
  },
  
  // Courses
  courses: {
    list: `${API_BASE_URL}/courses`,
    public: `${API_BASE_URL}/courses/public`,
    byId: (id: string) => `${API_BASE_URL}/courses/${id}`,
  },
  
  // Analytics
  analytics: {
    track: {
      pageView: `${API_BASE_URL}/analytics/track/page-view`,
      courseView: `${API_BASE_URL}/analytics/track/course-view`,
      videoAction: `${API_BASE_URL}/analytics/track/video-action`,
      session: `${API_BASE_URL}/analytics/track/session`,
      sessionActivity: `${API_BASE_URL}/analytics/track/session-activity`,
    },
    admin: {
      realTime: `${API_BASE_URL}/analytics/admin/real-time`,
      summary: `${API_BASE_URL}/analytics/admin/summary`,
    },
  },
  
  // Health
  health: {
    check: `${API_BASE_URL}/health`,
    ready: `${API_BASE_URL}/health/ready`,
  },
};

// WebSocket endpoints
export const WS_ENDPOINTS = {
  adminDashboard: `${WS_BASE_URL}/admin-dashboard`,
};
