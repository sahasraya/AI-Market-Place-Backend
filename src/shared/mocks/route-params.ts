// src/shared/mocks/route-params.ts

// Dummy ID values for prerendering
export const adminIds: string[] = ['admin123', 'admin456'];
export const memberIds: string[] = ['member001', 'member002'];
export const staffUserIds: { uid: string; adminid: string }[] = [
  { uid: 'user001', adminid: 'admin123' },
  { uid: 'user002', adminid: 'admin456' }
];
export const productIds: string[] = ['prod001', 'prod002', 'prod003'];