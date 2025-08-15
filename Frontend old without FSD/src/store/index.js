import { createStore } from 'vuex'
import auth from './modules/auth'
import requests from './modules/requests'
import products from './modules/products'
import feedback from './modules/feedback'
import dashboard from './modules/dashboard'
import notifications from './modules/notifications'
import calculations from './modules/calculations'
import statistics from './modules/statistics'

export default createStore({
  modules: {
    auth,
    requests,
    products,
    feedback,
    dashboard,
    notifications,
    calculations,
    statistics
  }
})
