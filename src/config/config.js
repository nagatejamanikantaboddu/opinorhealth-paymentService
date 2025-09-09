import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Payment Service .env
dotenv.config({ path: path.resolve(__dirname, '../../.env.payment') });

// Joi schema for validation
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3001),

    MONGODB_URL: Joi.string().required(),

    JWT_SECRET: Joi.string().required(),
    TOKEN_EXPIRY: Joi.string().required(),
    SALT_ROUNDS: Joi.number().required(),

    AWS_REGION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),

    FAST_2_SMS_KEY: Joi.string().required(),
    FAST_2_SMS_URL: Joi.string().uri().required(),

    REDIS_URL: Joi.string().uri().optional(),
    REDIS_PASSWORD: Joi.string().optional(),
    REDIS_HOST: Joi.string().optional(),
    REDIS_PORT: Joi.number().optional(),

    EMAIL_API_KEY: Joi.string().required(),
    SENDER_EMAIL: Joi.string().email().required(),

    TWILIO_ACCOUNT_SID: Joi.string().optional(),
    TWILIO_API_KEY_SID: Joi.string().optional(),
    TWILIO_API_KEY_SECRET: Joi.string().optional(),

    // 🔹 Razorpay keys
    RAZORPAY_KEY_ID: Joi.string().required(),
    RAZORPAY_KEY_SECRET: Joi.string().required(),
}).unknown();

// Validate env vars
const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration
export default {
    env: envVars.NODE_ENV,
    port: envVars.PORT,

    mongoose: {
        url:
            envVars.MONGODB_URL +
            (envVars.NODE_ENV === 'development' ? 'payment_service' : ''),
        options: {},
    },

    saltRounds: envVars.SALT_ROUNDS,
    tokenExpiry: envVars.TOKEN_EXPIRY,
    JWT_SECRET: envVars.JWT_SECRET,

    jwt: {
        secret: envVars.JWT_SECRET,
    },

    AWS_REGION: envVars.AWS_REGION,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,

    FAST_2_SMS_KEY: envVars.FAST_2_SMS_KEY,
    FAST_2_SMS_URL: envVars.FAST_2_SMS_URL,

    redis: {
        url: envVars.REDIS_URL,
        password: envVars.REDIS_PASSWORD,
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
    },

    EMAIL_API_KEY: envVars.EMAIL_API_KEY,
    SENDER_EMAIL: envVars.SENDER_EMAIL,

    TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY_SID: envVars.TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET: envVars.TWILIO_API_KEY_SECRET,

    // 🔹 Razorpay config
    razorpay: {
        keyId: envVars.RAZORPAY_KEY_ID,
        keySecret: envVars.RAZORPAY_KEY_SECRET,
    },
};
