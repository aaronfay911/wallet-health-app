import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "687d05b0273fea034ed3d853", 
  requiresAuth: true // Ensure authentication is required for all operations
});
