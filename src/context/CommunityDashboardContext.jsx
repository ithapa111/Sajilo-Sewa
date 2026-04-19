import { createContext, useContext } from 'react';

export const CommunityDashboardContext = createContext(null);

export const useCommunityDashboard = () => {
  const context = useContext(CommunityDashboardContext);

  if (!context) {
    throw new Error('useCommunityDashboard must be used within CommunityDashboardContext.');
  }

  return context;
};
