import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/main.css'

import { formatPrice, formatDate } from './utils/formatters'
import * as helpers from './utils/helpers'
import * as validators from './utils/validators'

const app = createApp(App)

app.config.globalProperties.$formatPrice = formatPrice
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$helpers = helpers
app.config.globalProperties.$validators = validators

app.config.globalProperties.$notify = function(options) {
  store.dispatch(`notifications/${options.type}`, {
    title: options.title,
    message: options.text,
    timeout: options.timeout
  })
}
            
app.use(store)
app.use(router)
app.mount('#app')
