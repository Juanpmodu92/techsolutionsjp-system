import app from './app.js';
import { env } from './config/env.js';
import { testDatabaseConnection } from './config/db.js';

async function startServer() {
  try {
    const dbInfo = await testDatabaseConnection();
    console.log('Database connected:', dbInfo.dbName, dbInfo.currentTime);

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();