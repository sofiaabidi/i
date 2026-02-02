import User from '../models/User.js';
import Review from '../models/Review.js';

export const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const reviewCount = await Review.countDocuments();
    
    const reviews = await Review.find();
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      stats: {
        activeUsers: userCount,
        totalReviews: reviewCount,
        averageRating: averageRating,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
