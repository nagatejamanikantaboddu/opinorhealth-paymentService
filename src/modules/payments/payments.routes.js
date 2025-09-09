import { Router } from "express";
import catchAsync from '../../config/catchAsync.js';
import validate from '../../config/validation.js';
import { authorize } from '../../middlewares/Auth.middleware.js';
import {paymentsValidationSchema,paymentStatusValidation,paymentVerifyValidation} from './payments.validations.js';
import paymentsController from "./payments.controller.js";

const router = Router();


// Create a new payment
router.post(
    '/create',
    authorize('USER'),
    validate(paymentsValidationSchema),
    (req, res) => catchAsync(paymentsController.createPayment(req, res))
);

// Verify a payment
router.post(
    '/verify',validate(paymentVerifyValidation),
    authorize('USER'),
    (req, res) => catchAsync(paymentsController.verifyPayment(req, res))
);

// Get payment status by referenceId
router.get(
    '/status/:referenceId',validate(paymentStatusValidation),
    authorize('USER'),
    (req, res) => catchAsync(paymentsController.getPaymentStatus(req, res))
);

export default router;
