// 全局样式设置
import '@/styles/index.css'
import 'element-plus/theme-chalk/display.css'
import '@/assets/AliIconFont/iconfont.css'

import { createApp } from 'vue'
import Echarts from 'vue-echarts'
import * as echarts from 'echarts'

import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

app.use(pinia)

app.component('e-charts', Echarts)
app.config.globalProperties.$echarts = echarts

app.use(router)

app.mount('#app')
