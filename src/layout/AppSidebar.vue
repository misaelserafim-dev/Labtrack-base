<script setup>
import { ref } from 'vue';
import AppMenu from './AppMenu.vue';

const model = ref([
    {
        items: [
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-user pi-sign-in',
                        to: '/auth/login'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-power-off pi-sign-in',
                        to: '/auth/logout'
                    },
                    {
                        label: 'Configuração',
                        icon: 'pi pi-cog pi-sign-in',
                        to: '/pages/configuracao'
                    },
                ]
            },
        ]
    }
]);
</script>

<template>
    <div class="layout-sidebar">
        <app-menu></app-menu>
        <ul class="autenticaion-sidebar-item-menu bottom-0 left-0 w-full p-5 transition duration-300 overflow-hidden layout-menu layout-submenu">
            
            <li class="active-menuitem">
                <h3 class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Minha conta</h3>
                <Transition 
                    v-if="model[0].items[0].items && model[0].items[0].visible !== false" 
                    name="layout-submenu"
                >
                    <ul v-show="true" class="layout-submenu">
                        <!-- Loop para os itens do submenu -->
                        <li 
                            v-for="(child, i) in model[0].items[0].items" 
                            :key="i" 
                            class=""
                        >
                            <a :href="child.to" class="" :index="i">
                                <i :class="child.icon + ' layout-menuitem-icon'"></i>
                                <span class="layout-menuitem-text">{{ child.label }}</span>
                            </a>
                        </li>
                    </ul>
                </Transition>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped></style>
