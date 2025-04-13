/**
 * Application configuration utility
 * Provides access to environment variables and configuration settings
 */

// School information configuration
export const schoolConfig = {
  // Application settings
  appName: process.env.APP_NAME || 'SchoolFinAI',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // School information
  name: process.env.SCHOOL_NAME || 'School Name',
  tagline: process.env.SCHOOL_TAGLINE || 'Excellence in Education',
  address: process.env.SCHOOL_ADDRESS || '',
  phone: process.env.SCHOOL_PHONE || '',
  email: process.env.SCHOOL_EMAIL || '',
  website: process.env.SCHOOL_WEBSITE || '',
  logoUrl: process.env.SCHOOL_LOGO_URL || '/images/default-logo.png',
};

// Database configuration
export const dbConfig = {
  url: process.env.DATABASE_URL,
};

// Authentication configuration
export const authConfig = {
  nextAuthUrl: process.env.NEXTAUTH_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
};

// SMS configuration
export const smsConfig = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
};

// File upload configuration
export const uploadConfig = {
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  s3BucketName: process.env.S3_BUCKET_NAME,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  s3Region: process.env.S3_REGION,
};

// AI configuration
export const aiConfig = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  pineconeApiKey: process.env.PINECONE_API_KEY,
  pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
};

// Default export for convenience
export default {
  school: schoolConfig,
  db: dbConfig,
  auth: authConfig,
  sms: smsConfig,
  upload: uploadConfig,
  ai: aiConfig,
};
