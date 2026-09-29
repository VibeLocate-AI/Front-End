import { apiClient } from './api'

const extractReviewData = (payload = {}) => {
  const data = payload?.data || payload
  return {
    average: Number(data.average_rating ?? data.rating_average ?? data.average ?? 0),
    count: Number(data.ratings_count ?? data.reviews_count ?? data.count ?? 0),
    userRating: Number(data.rating ?? data.user_rating?.rating ?? 0),
    userComment: data.review ?? data.user_rating?.review ?? data.comment ?? ''
  }
}

export const propertyRatingService = {
  // Get current user's review for a property
  async getReview(propertyId) {
    return extractReviewData(await apiClient.get(`/properties/${propertyId}/review`))
  },
  
  // Submit a new review
  async submitReview(propertyId, { rating, review }) {
    return extractReviewData(await apiClient.post(`/properties/${propertyId}/review`, { rating, review }))
  },

  // Update an existing review
  async updateReview(propertyId, { rating, review }) {
    return extractReviewData(await apiClient.put(`/properties/${propertyId}/review`, { rating, review }))
  },

  // Delete a review
  async deleteReview(propertyId) {
    return await apiClient.delete(`/properties/${propertyId}/review`)
  }
}

export default propertyRatingService
