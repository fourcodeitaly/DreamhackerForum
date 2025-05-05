// Environment variables utility
export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  useLocalAuth: process.env.USE_LOCAL_AUTH === "true",
}
