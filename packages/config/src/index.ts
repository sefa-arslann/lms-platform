import { z } from 'zod';

// Environment Variables Schema
export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // AWS S3
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  
  // Payment Providers
  PAYTR_MERCHANT_ID: z.string(),
  PAYTR_MERCHANT_KEY: z.string(),
  PAYTR_MERCHANT_SALT: z.string(),
  
  IYZICO_API_KEY: z.string(),
  IYZICO_SECRET_KEY: z.string(),
  
  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.number().default(587),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.number().default(3001),
  WEB_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:3001'),
  
  // Security
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW: z.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX: z.number().default(100),
  
  // Device Management
  MAX_DEVICES_PER_USER: z.number().default(3),
  DEVICE_APPROVAL_EXPIRES_IN: z.number().default(900), // 15 minutes
});

export type EnvConfig = z.infer<typeof envSchema>;

// Default Configuration
export const defaultConfig: Partial<EnvConfig> = {
  NODE_ENV: 'development',
  PORT: 3001,
  WEB_URL: 'http://localhost:3000',
  API_URL: 'http://localhost:3001',
  CORS_ORIGIN: 'http://localhost:3000',
  RATE_LIMIT_WINDOW: 900000,
  RATE_LIMIT_MAX: 100,
  MAX_DEVICES_PER_USER: 3,
  DEVICE_APPROVAL_EXPIRES_IN: 900,
};

// Validation function
export function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    process.exit(1);
  }
}
