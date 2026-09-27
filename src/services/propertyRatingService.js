import { apiClient } from './api'

const extractSummary = (payload = {}) => {
  const data = payload?.data || payload
  return {
    average: Number(data.average_rating ?? data.rating_average ?? data.average ?? 0),
    count: Number(data.ratings_count ?? data.reviews_count ?? data.count ?? 0),
    userRating: Number(data.user_rating?.rating ?? data.user_rating ?? 0),
    userComment: data.user_rating?.comment || data.user_comment || ''
  }
}

export const propertyRatingService = {
  async getSummary(propertyId) {
    return extractSummary(await apiClient.get(`/properties/${propertyId}/ratings`))
  },
  async submit(propertyId, { rating, comment }) {
    return extractSummary(await apiClient.post(`/properties/${propertyId}/ratings`, { rating, comment }))
  }
}

export default propertyRatingService
