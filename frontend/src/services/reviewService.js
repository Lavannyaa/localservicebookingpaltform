import { reviews } from '../data/reviews';

let localReviews = [...reviews];

export const reviewService = {
  async getReviews(providerId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (providerId) {
          resolve(localReviews.filter(r => r.providerId === providerId));
        } else {
          resolve([...localReviews]);
        }
      }, 60);
    });
  },

  async addReview(reviewData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview = {
          reviewId: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          providerReply: null,
          ...reviewData
        };
        localReviews = [newReview, ...localReviews];
        resolve(newReview);
      }, 90);
    });
  },

  async addProviderReply(reviewId, replyText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localReviews = localReviews.map(r => r.reviewId === reviewId ? { ...r, providerReply: replyText } : r);
        resolve({ success: true, reviewId, replyText });
      }, 60);
    });
  }
};
