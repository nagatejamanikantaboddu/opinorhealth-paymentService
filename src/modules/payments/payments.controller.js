import Master from '../../config/Master.class.js';
import ApiError from '../../config/APIError.js';
import PaymentService from './payments.service.js';

/**
 * @name : PaymentController
 */
class PaymentController extends Master {
    constructor() {
        super();
        Object.freeze(this);
    }

    /**
     * @description: Create a new payment
     */
    async createPayment(req, res) {
        try {
            this.logger.info("PaymentController: Inside createPaymentController");

            const { amount, currency, description, doctorId, serviceType, idempotencyKey } = req.body;
            const userId = req.user.id;

            const response = await PaymentService.createPayment(
                amount,
                currency,
                description,
                userId,
                doctorId,
                serviceType,
                idempotencyKey
            );

            res.status(this.HTTP_STATUS.CREATED).json(response);
        } catch (error) {
            this.logError("PaymentController: Error in createPayment", error);
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(this.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    error: "Internal Server Error",
                    message: error.message
                });
            }
        }
    }

    /**
     * @description: Verify payment signature from Razorpay
     */
  async verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, referenceId } = req.body;

    // Verify signature
    const isValid = await PaymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (isValid) {
      await PaymentService.updatePaymentStatus(referenceId, "success");
      return res.status(this.HTTP_STATUS.OK).json({
        success: true,
        message: "Payment verified & updated",
      });
    } else {
      await PaymentService.updatePaymentStatus(referenceId, "failed");
      return res.status(this.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    this.logError("PaymentController: Error in verifyPayment", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(this.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
}



    /**
     * @description: Get payment status by referenceId
     */
    async getPaymentStatus(req, res) {
        try {
            const { referenceId } = req.params;

            const paymentStatus = await PaymentService.getPaymentStatus(referenceId);
            if (!paymentStatus) {
                throw new ApiError(this.HTTP_STATUS.NOT_FOUND, "Payment not found");
            }

            res.status(this.HTTP_STATUS.OK).json({ success: true, data: paymentStatus });
        } catch (error) {
            this.logError("PaymentController: Error in getPaymentStatus", error);
            if (error instanceof ApiError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                res.status(this.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    error: "Internal Server Error",
                    message: error.message
                });
            }
        }
    }


    
}

export default new PaymentController();
