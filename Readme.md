````markdown
# Opinor Health - Payment Service

Payment Service microservice handles **Razorpay payments**, stores transactions, and provides endpoints for creating and tracking payments.

---

## Technologies

 **Node.js**: Backend runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: Database management system
- **Mongoose**: MongoDB object modeling for Node.js
- **Babel**: JavaScript compiler for backward compatibility
- **Compression**: Middleware for HTTP compression
- **Cors**: Cross-Origin Resource Sharing handling
- **Dotenv**: Environment variable management
- **Express Mongo Sanitize**: Middleware to prevent MongoDB Operator Injection
- **Helmet**: Security middleware for HTTP headers
- **HTTP Status**: Utility to interact with HTTP status codes
- **Joi**: Object schema validation
- **Morgan**: HTTP request logger middleware
- **Nodemon**: Utility to auto-restart the server on file changes
- **Winston**: Logging library
- **XSS Clean**: Sanitization to prevent cross-site scripting attacks
  

---

## Setup

1. **Install Dependencies**:

```
- yarn install
````

2. **Environment Variables** (`.env` or `.env.payment`):
NODE_ENV=development
PORT=3001

# MongoDB
MONGODB_URL=mongodb://localhost:27017/payment_service

# JWT
JWT_SECRET=your_jwt_secret
TOKEN_EXPIRY=1d
SALT_ROUNDS=10

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password   # optional
REDIS_HOST=localhost
REDIS_PORT=6379

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_API_KEY_SID=your_twilio_key_sid
TWILIO_API_KEY_SECRET=your_twilio_key_secret

# SendGrid Email
EMAIL_API_KEY=your_sendgrid_api_key
SENDER_EMAIL=your_email@example.com


3. **Start Server**:

```
yarn start
```

---

## API

### Create Payment

**POST** `/v1/api/payments/create`

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**

```json
{
  "doctorId": "68a37c1621ba02afd1302e9f",
  "amount": 50000,
  "serviceType": "CONSULTATION",
  "description": "Consultation payment"
}
```

**Response:**

```json
{
  "success": true,
  "payment": {
    "userId": "64f5abc1234567890abcdef0",
    "doctorId": "68a37c1621ba02afd1302e9f",
    "amount": 50000,
    "status": "pending",
    "paymentMethod": "razorpay",
    "referenceId": "ORD-12345678",
    "serviceType": "CONSULTATION",
    "description": "Consultation payment",
    "createdAt": "2025-09-08T12:34:56.789Z",
    "updatedAt": "2025-09-08T12:34:56.789Z"
  }
}
```

---

## Payment Flow

1. User initiates payment → `POST /payments/create`
2. Server creates Razorpay order with `referenceId`
3. Server returns order info to frontend
4. Frontend completes payment via Razorpay checkout
5. Webhook/callback updates payment status

---

## Database Schema

| Field             | Type   | Description                                |
| ----------------- | ------ | ------------------------------------------ |
| userId            | String | User ID from main service                  |
| doctorId          | String | Doctor ID                                  |
| amount            | Number | Payment in paise                           |
| status            | String | `pending`, `success`, `failed`, `refunded` |
| paymentMethod     | String | Defaults `razorpay`                        |
| razorpayOrderId   | String | Razorpay order ID                          |
| razorpayPaymentId | String | Razorpay payment ID                        |
| razorpaySignature | String | Razorpay signature                         |
| referenceId       | String | Custom order reference                     |
| serviceType       | String | `CONSULTATION`                             |
| notes             | String | Optional                                   |
| refundStatus      | String | `not_requested`, `requested`, `completed`  |
| createdAt         | Date   | Timestamp                                  |
| updatedAt         | Date   | Timestamp                                  |

---
## License

---
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Feel free to expand this README with more detailed instructions, architecture overview, or any other pertinent information about your specific OPiNOR HEALTH backend setup.
