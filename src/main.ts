import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { PiniaColada } from '@pinia/colada'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'

const router = createRouter({
    history: createWebHistory(),
    routes,
  })

console.log(routes);


const app = createApp(App)

app.use(createPinia())
// Issue : typer les plugins ?
app.use(PiniaColada)
app.use(DataLoaderPlugin, { router }) 
app.use(router)

app.mount('#app')
