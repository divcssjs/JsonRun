import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/view/home'

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {
            title: 'json在线格式化 - JSON Run',
        },
        component: Home,
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to) => {
    const title = to.meta.title || '没有title'
    document.title = title
    return true
})

export default router
