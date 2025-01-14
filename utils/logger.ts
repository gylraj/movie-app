export const logger = (message: string, data?: any) => {
  console.log(`[LOG] ${message}`, data || '');
};
