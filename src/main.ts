import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { PiniaColada } from '@pinia/colada'

const app = createApp(App)

app.use(createPinia())
// Issue : typer les plugins ?
app.use(PiniaColada)
app.use(router)

app.mount('#app')
