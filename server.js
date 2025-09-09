import mongoose from 'mongoose';
import app from './index.js';
import config from './src/config/config.js';
import chalk from 'chalk';

// Banner printer
const printBanner = (title, color = chalk.green.bold) => {
    const line = '########################################';
    console.log(color(line));
    console.log(color(`###   ${title.padEnd(28)}###`));
    console.log(color(line));
};

let server;
// let redisClient;  // Redis commented out

mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
        printBanner('✅ Payment MongoDB connected successfully!', chalk.cyanBright.bold);
        printBanner(`${config.mongoose.url}`, chalk.cyanBright.bold);

        // Redis setup (commented)
        /*
        redisClient = createClient({
            url: config.redis.url,
        });

        redisClient.on('error', (err) => {
            printBanner(`❌ Redis Client Error: ${err.message}`, chalk.red.bold);
        });

        try {
            await redisClient.connect();
            printBanner('✅ Redis connected successfully!', chalk.yellowBright.bold);
        } catch (err) {
            printBanner(`❌ Failed to connect to Redis: ${err.message}`, chalk.red.bold);
        }
        */

        server = app.listen(config.port, () => {
            printBanner(`🚀 Payment Service running on port ${config.port} in ${config.env} mode`, chalk.magenta.bold);
        });
    })
    .catch((err) => {
        printBanner(`❌ Failed to connect to Payment MongoDB: ${err.message}`, chalk.red.bold);
        process.exit(1);
    });

export { server };
// export { redisClient, server };  // Redis removed
