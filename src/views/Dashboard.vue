<script setup>
import Breadcrumb from 'primevue/breadcrumb';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbItems = computed(() => {
    const segments = route.path.split('/').filter(Boolean);
    return segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1); 
        return { label, to: path };
    });
});

const home = { label: "Dashbord", icon: 'pi pi-home', to: '/' };
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <!-- Breadcrumb -->
        <div class="col-span-12">
            <Breadcrumb :model="breadcrumbItems" :home="home" />
        </div>

        <!-- Widgets -->
        <div class="col-span-12 xl:col-span-6">
            <RecentSalesWidget />
            <BestSellingWidget />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <RevenueStreamWidget />
            <NotificationsWidget />
        </div>
    </div>
</template>
