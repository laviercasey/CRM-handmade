import feedbackService from '@/services/feedback.service'

export default {
  namespaced: true,
  
  state: {
    feedbacks: [],
    loading: false,
    error: null,
    submitting: false
  },
  
  mutations: {
    SET_FEEDBACKS(state, feedbacks) {
      state.feedbacks = feedbacks
    },
    
    ADD_FEEDBACK(state, feedback) {
      state.feedbacks.unshift(feedback)
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_SUBMITTING(state, submitting) {
      state.submitting = submitting
    },
    
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchFeedbacks({ commit }, params = {}) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const feedbacks = await feedbackService.getFeedbacks(params)
        commit('SET_FEEDBACKS', feedbacks)
        
        return feedbacks
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch feedbacks')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createFeedback({ commit }, feedbackData) {
      try {
        commit('SET_SUBMITTING', true)
        commit('SET_ERROR', null)
        
        const newFeedback = await feedbackService.createFeedback(feedbackData)
        commit('ADD_FEEDBACK', newFeedback)
        
        return newFeedback
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to submit feedback')
        throw error
      } finally {
        commit('SET_SUBMITTING', false)
      }
    },
    
    async submitFaqFeedback({ commit }, { questionId, isHelpful }) {
      try {
        commit('SET_SUBMITTING', true)
        commit('SET_ERROR', null)
        
        const response = await feedbackService.submitFaqFeedback(questionId, isHelpful)
        return response
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to submit FAQ feedback')
        throw error
      } finally {
        commit('SET_SUBMITTING', false)
      }
    }
  },
  
  getters: {
    allFeedbacks: state => state.feedbacks,
    isLoading: state => state.loading,
    isSubmitting: state => state.submitting,
    error: state => state.error,
    
    positiveFeedbacks: state => {
      return state.feedbacks.filter(feedback => feedback.type === 'positive')
    },
    
    negativeFeedbacks: state => {
      return state.feedbacks.filter(feedback => feedback.type === 'negative')
    },
    
    feedbacksCount: state => state.feedbacks.length
  }
}
