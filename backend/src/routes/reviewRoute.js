import express from 'express';
import { createReview, getAllReviews, deleteReview } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createReview);
router.get('/', getAllReviews);
router.delete('/:id', authenticate, deleteReview);

export default router;
