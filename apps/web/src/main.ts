import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router, { setupRouter } from './router'
import App from './App.vue'
import './styles/variables.css'
import './styles/globals.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

setupRouter(app)

app.mount('#app')