import Router from 'express';
import PaymentRoutes from '../../modules/payments/payments.routes.js';

const router = Router();

// Payment routes
router.use('/payments', PaymentRoutes);

export default router;
