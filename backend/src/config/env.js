import dotenv from 'dotenv';

dotenv.config({ override: true });

export const env = {
  port: process.env.PORT || 3000,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:admin1234@127.0.0.1:5432/techsolutionsjp_db',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret'
};

console.log('Loaded DATABASE_URL:', env.databaseUrl);