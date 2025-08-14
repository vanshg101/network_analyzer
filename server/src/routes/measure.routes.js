import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendData,getData } from '../controllers/measure.controllers.js';
const router = express.Router();

// Wrap both async functions with asyncHandler
router.route('/sendData').post(asyncHandler(sendData));
router.route('/getData').post(asyncHandler(getData));

export default router;
