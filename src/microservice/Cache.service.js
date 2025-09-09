// import { redisClient } from "../../server.js";
// import Master from "../config/Master.class.js";

// class CacheService {
//     constructor(prefix = 'cache', defaultTTL = 60) {
//         this.prefix = prefix;
//         this.defaultTTL = defaultTTL;
//     }

//     getKey(key) {
//         return `${this.prefix}:${key}`;
//     }

//     async getFromCache(key) {
//         const cacheKey = this.getKey(key);
//         const cachedData = await redisClient.get(cacheKey);
//         if (cachedData) {
//             console.log(`⚡️ Cache hit for key: ${key}`);
//             return JSON.parse(cachedData);
//         }
//         console.log(`❌ Cache miss for key: ${key}`);
//         return null;
//     }

//     async setCache(key, data, ttl = this.defaultTTL) {
//         const cacheKey = this.getKey(key);
//         console.log(`✅ Setting cache for key: ${key}`);
//         await redisClient.setEx(cacheKey, ttl, JSON.stringify(data));
//     }

//     async deleteCache(key) {
//         const cacheKey = this.getKey(key);
//         console.log(`🧹 Deleting cache for key: ${key}`);
//         await redisClient.del(cacheKey);
//     }
// }

// export { CacheService } 
