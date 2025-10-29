// src/api/config.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://46.101.103.22:8001';

export const API_CONFIG = {
  // Auth Endpoints
  auth: {
    register: { method: 'POST', url: '/api/v1/auth/register' },
    login: { method: 'POST', url: '/api/v1/auth/login' },
    me: { method: 'GET', url: '/api/v1/auth/me' },
    profile: { method: 'GET', url: '/api/v1/auth/profile' },
    exportWallet: { method: 'GET', url: '/api/v1/auth/export-wallet' },
  },

  // Projects Endpoints
  projects: {
    list: { method: 'GET', url: '/api/v1/projects/' },
    create: { method: 'POST', url: '/api/v1/projects/' },
    uploadImage: (project_id) => ({ method: 'POST', url: `/api/v1/projects/${project_id}/image` }),
    get: (project_id) => ({ method: 'GET', url: `/api/v1/projects/${project_id}` }),
    transparency: (project_id) => ({ method: 'GET', url: `/api/v1/projects/${project_id}/transparency` }),
    verify: (project_id) => ({ method: 'PATCH', url: `/api/v1/projects/${project_id}/verify` }),
  },

  // Donations
  donations: {
    make: { method: 'POST', url: '/api/v1/donations/' },
  },

  // Trace
  trace: {
    get: (tx_hash) => ({ method: 'GET', url: `/api/v1/trace/trace/${tx_hash}` }),
  },

  // P2P Transfers
  p2p: {
    transfer: { method: 'POST', url: '/api/v1/p2p/transfer' },
    balance: { method: 'GET', url: '/api/v1/p2p/balance' },
    validateWallet: { method: 'POST', url: '/api/v1/p2p/validate-wallet' },
  },

  // Analytics
  analytics: {
    userInsights: { method: 'GET', url: '/api/v1/analytics/user/insights' },
    globalStats: { method: 'GET', url: '/api/v1/analytics/global/stats' },
    platformOverview: { method: 'GET', url: '/api/v1/analytics/platform/overview' },
    project: (project_id) => ({ method: 'GET', url: `/api/v1/analytics/project/${project_id}` }),
    topCategories: { method: 'GET', url: '/api/v1/analytics/categories/top' },
    compareUser: { method: 'GET', url: '/api/v1/analytics/user/compare' },
  },

  // Default / Health
  health: { method: 'GET', url: '/' },
};

// Helper to build full URL
export const buildUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;