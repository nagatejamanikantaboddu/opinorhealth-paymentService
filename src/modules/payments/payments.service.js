import razorpay from "../../config/razorpay.config.js";
import { PaymentModel } from "./payments.model.js";
import Master from "../../config/Master.class.js";
import crypto from "crypto";

class PaymentService extends Master {
  constructor() {
    super();
    Object.freeze(this);
  }

  // Create payment with idempotency and audit
  async createPayment(amount, currency = "INR", description = "", userId, doctorId, serviceType, idempotencyKey) {
    try {
      // Check idempotency
      if (idempotencyKey) {
        const existing = await PaymentModel.findOne({ idempotencyKey });
        if (existing) return { success: true, data: existing };
      }

      const amountInPaise = amount * 100;
      console.log("Creating Razorpay order for amount:", amountInPaise);
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: { description, userId, doctorId, serviceType },
      });
      console.log("Razorpay order created:", razorpayOrder.id);

     const referenceId = `PAY_${userId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const paymentDoc = await PaymentModel.create({
        userId,
        doctorId,
        amount,
        currency,
        status: "pending",
        paymentMethod: "razorpay",
        razorpayOrderId: razorpayOrder.id,
        referenceId,
        serviceType,
        notes: description,
        idempotencyKey,
        history: [{ status: "pending" }],
      });

      return {
        success: true,
        data: {
          orderId: razorpayOrder.id,
          amount,
          currency,
          referenceId,
          status: paymentDoc.status,
        },
      };
    } catch (error) {
      this.logError("PaymentService: Error in createPayment", error);
      throw error;
    }
  }

  // Verify Razorpay signature
  verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
      console.log(generatedSignature)
      console.log("Order ID:", razorpayOrderId);
console.log("Payment ID:", razorpayPaymentId);
console.log("Your Secret:", process.env.RAZORPAY_KEY_SECRET);
console.log("Generated Signature:", generatedSignature);
console.log("Provided Signature:", razorpaySignature);

    
    return generatedSignature === razorpaySignature;
  }

  // Update payment status with audit trail
  async updatePaymentStatus(referenceId, newStatus) {
    const payment = await PaymentModel.findOne({ referenceId });
    if (!payment) throw new Error("Payment not found");

    payment.status = newStatus;
    payment.history.push({ status: newStatus });
    await payment.save();

    return payment;
  }

   async getPaymentStatus(referenceId) {
    return await PaymentModel.findOne({ referenceId }).select('-__v');
  }

}

export default new PaymentService();
