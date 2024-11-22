<template>
    <div class="max-w-3xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-lg m-20">
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Detalhes do Usuário</h2>
  
      <div v-if="errorMessage" class="text-red-600 text-lg mb-6">
        {{ errorMessage }}
      </div>
  
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <label class="text-gray-700 font-medium w-full sm:w-32">Nome</label>
          <div class="text-lg text-gray-900">{{ user.username }}</div>
        </div>
  
        <div class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <label class="text-gray-700 font-medium w-full sm:w-32">Email</label>
          <div class="text-lg text-gray-900">{{ user.email }}</div>
        </div>
  
        <div class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <label class="text-gray-700 font-medium w-full sm:w-32">Telefone</label>
          <div class="text-lg text-gray-900">{{ user.phone }}</div>
        </div>
  
        <div class="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4">
          <label class="text-gray-700 font-medium w-full sm:w-32">Endereço</label>
          <div class="text-lg text-gray-900">{{ user.address }}</div>
        </div>
      </div>
  
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
        <button @click="editUser" class="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out transform hover:scale-105">
          Editar Usuário
        </button>
        <button @click="logout" class="w-full sm:w-auto px-6 py-3 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary transition duration-300 ease-in-out transform hover:scale-105">
          Sair
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'UserCard',
    data() {
      return {
        user: {
          username: '',
          email: '',
          phone: '',
          address: '',
          role: 'USER'
        },
        errorMessage: null
      };
    },
    async created() {
      const userId = localStorage.getItem('userId') || 1;
      await this.fetchUserDetails(userId);
    },
    methods: {
      async fetchUserDetails(userId) {
        try {
          const response = await api.get(`/users/${userId}`);
          this.user = response.data;
        } catch (error) {
          this.errorMessage = 'Erro ao carregar os dados do usuário.';
          console.error(error);
        }
      },
      editUser() {
        this.$router.push(`/edit/user/` + localStorage.getItem('userId'));
      },
      logout() {
        localStorage.clear();
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  @media (max-width: 640px) {
    .text-lg {
      font-size: 1rem;
    }
    .w-32 {
      width: auto;
    }
  }
  </style>
  