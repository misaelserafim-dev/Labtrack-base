<script setup>
import { ref } from 'vue';

const user = ref({
    name: "Misael Serafim",
    email: "misael.serafim@example.com",
    phone: "(11) 99999-9999",
    address: "Rua de teste, 123, Curitiba, PR",
    birthDate: "1995-10-05",
});

const editMode = ref(false);

const saveChanges = () => {
    editMode.value = false;
};
</script>

<template>
    <div class="col-span-12 ">
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 xl:col-span-6">
                <div class="card p-6 rounded-lg">
            <div class="font-semibold text-xl mb-8">Minha Conta</div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Nome:</label>
                <input 
                    type="text" 
                    v-model="user.name" 
                    class="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                    :disabled="!editMode"
                />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">E-mail:</label>
                <input 
                    type="email" 
                    v-model="user.email" 
                    class="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                    :disabled="!editMode"
                />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Telefone:</label>
                <input 
                    type="text" 
                    v-model="user.phone" 
                    class="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                    :disabled="!editMode"
                />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Endereço:</label>
                <input 
                    type="text" 
                    v-model="user.address" 
                    class="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                    :disabled="!editMode"
                />
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Data de Nascimento:</label>
                <input 
                    type="date" 
                    v-model="user.birthDate" 
                    class="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                    :disabled="!editMode"
                />
            </div>

            <div class="flex justify-end space-x-4">
                <Button v-if="!editMode" class="px-4 py-2 g-gray-800" label="Editar" @click="editMode = true" ></Button>
                <Button v-else  label="Salvar" @click="saveChanges" ></Button>
            </div>
        </div>
            </div>
        </div>
        
    </div>
    
</template>

<style scoped>
</style>
