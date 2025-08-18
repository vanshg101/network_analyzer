import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendData,getData } from '../controllers/measure.controllers.js';
import { aggregateSpeedData } from '../controllers/aggregate.controller.js';

const router = express.Router();

// Wrap both async functions with asyncHandler
router.route('/sendData').post(asyncHandler(sendData));
router.route('/getData').get(asyncHandler(getData));
router.route('/aggregated').get(asyncHandler(aggregateSpeedData));

export default router;
