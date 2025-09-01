/*
 * @Description: 主入口
 * @Author: StarTraceDev
 * @Date: 2025-08-04 20:43:26
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-01 16:03:36
 */
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
