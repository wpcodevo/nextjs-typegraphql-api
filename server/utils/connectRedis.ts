import { createClient } from 'redis';

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    setInterval(connectRedis, 5000);
  }
};

connectRedis();

redisClient.on('connect', () =>
  console.log('🚀 Redis client connected successfully')
);

redisClient.on('error', (err) => console.error(err));

export default redisClient;
