import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { label: 'Home' },
                },
            ],
        },
        {
            path: '/pages',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue'),
                    meta: { label: 'Crud' },
                },
                {
                    path: 'configuracao',
                    name: 'configuracao',
                    component: () => import('@/views/pages/Configuracao.vue'),
                    meta: { label: 'Configuração' },
                },
            ],
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { label: 'Login' },
        },
    ],
});

export default router;
