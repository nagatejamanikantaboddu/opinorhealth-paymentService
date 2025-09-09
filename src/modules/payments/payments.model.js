import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  doctorId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { 
    type: String, 
    enum: ["pending", "success", "failed", "refunded"], 
    default: "pending" 
  },
  paymentMethod: { type: String, default: "razorpay" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  referenceId: { type: String, required: true },
  serviceType: { type: String, enum: ["CONSULTATION"], required: true },
  notes: { type: String },
  idempotencyKey: { type: String, unique: true, sparse: true }, // optional but unique
  history: [
    {
      status: { type: String, enum: ["pending","success","failed","refunded"] },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  refundStatus: { type: String, enum: ["not_requested", "requested", "completed"], default: "not_requested" },
}, { timestamps: true });

export const PaymentModel = mongoose.model("Payment", paymentSchema);
