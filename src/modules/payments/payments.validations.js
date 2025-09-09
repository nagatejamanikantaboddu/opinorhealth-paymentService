import Joi from 'joi';

// ====== Create Payment Validation ======
const amountSchema = Joi.number().integer().positive().required().messages({
  "number.base": "Invalid format, Amount must be a number",
  "number.integer": "Amount must be an integer",
  "number.positive": "Amount must be positive",
  "any.required": "Amount is required"
});

const currencySchema = Joi.string().valid("INR").default("INR").messages({
  "any.only": "Only INR is allowed"
});

const doctorIdSchema = Joi.string().required().messages({
  "string.base": "Doctor ID must be a string",
  "any.required": "Doctor ID is required"
});

const serviceTypeSchema = Joi.string().valid("CONSULTATION").default("CONSULTATION").messages({
  "any.only": "Service type must be CONSULTATION"
});

const paymentsValidationSchema = {
  body: Joi.object({
    amount: amountSchema,
    currency: currencySchema,
    description: Joi.string().optional().messages({ "string.base": "Description must be a string" }),
    doctorId: doctorIdSchema,
    serviceType: serviceTypeSchema,
    idempotencyKey: Joi.string().optional()
  })
};

// ====== Verify Payment Validation ======
const paymentVerifyValidation = {
  body: Joi.object({
    razorpayOrderId: Joi.string().required().messages({
      "string.base": "Order ID must be a string",
      "any.required": "Order ID is required"
    }),
    razorpayPaymentId: Joi.string().required().messages({
      "string.base": "Payment ID must be a string",
      "any.required": "Payment ID is required"
    }),
    razorpaySignature: Joi.string().required().messages({
      "string.base": "Signature must be a string",
      "any.required": "Signature is required"
    }),
    referenceId: Joi.string().required().messages({
      "string.base": "Reference ID must be a string",
      "any.required": "Reference ID is required"
    })
  })
};

// ====== Payment Status Validation ======
const paymentStatusValidation = {
  params: Joi.object({
    referenceId: Joi.string().required().messages({
      "string.base": "Reference ID must be a string",
      "any.required": "Reference ID is required"
    })
  })
};

export { paymentsValidationSchema, paymentVerifyValidation, paymentStatusValidation };
