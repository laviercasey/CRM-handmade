import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/shared/store'
import '@/shared/styles/global.scss'

import { formatPrice, formatDate } from '@/shared/lib/formatters'
import * as helpers from '@/shared/lib/helpers'
import * as validators from '@/shared/lib/validation'

interface NotifyOptions {
  type: string
  title: string
  text: string
  timeout?: number
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatPrice: typeof formatPrice
    $formatDate: typeof formatDate
    $helpers: typeof helpers
    $validators: typeof validators
    $notify: (options: NotifyOptions) => void
  }
}

const app = createApp(App)

app.config.globalProperties.$formatPrice = formatPrice
app.config.globalProperties.$formatDate = formatDate
app.config.globalProperties.$helpers = helpers
app.config.globalProperties.$validators = validators

app.config.globalProperties.$notify = function(options: NotifyOptions) {
  store.dispatch(`notifications/${options.type}`, {
    title: options.title,
    message: options.text,
    timeout: options.timeout
  })
}
            
app.use(store)
app.use(router)

export default app