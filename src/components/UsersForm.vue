<template>
    <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ user.id ? 'Editar Usuário' : 'Cadastrar Usuário' }}</h2>
  
        <div v-if="errorMessage" class="mt-4 text-red-500">
          {{ errorMessage }}
        </div>
  
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="username">Nome</label>
            <input v-model="user.username" type="text" id="username" required
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200">
          </div>
  
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="email">Email</label>
            <input v-model="user.email" type="email" id="email" required
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200">
          </div>
  
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="phone">Telefone</label>
            <input v-model="user.phone" type="text" id="phone" v-mask="'(##) #####-####'" required
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
              placeholder="(00) 00000-0000">
          </div>
  
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="address">Endereço</label>
            <input v-model="user.address" type="text" id="address" required
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200">
          </div>
  
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="password">Senha</label>
            <input v-model="user.password" type="password" id="password" :required="!user.id"
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200">
          </div>
  
          <div v-if="isAdmin()">
            <label class="block text-gray-700 font-semibold mb-2" for="role">Função</label>
            <select v-model="user.role" id="role" required
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200">
              <option disabled value="">Selecione uma função</option>
              <option value="USER">Usuário</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
  
          <div class="mt-6 flex justify-end space-x-4">
            <button @click="goBack" type="button"
              class="bg-gray-400 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition duration-200">Cancelar</button>
            <button type="submit" :disabled="isLoading"
              class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200">
              <span v-if="isLoading">Carregando...</span>
              <span v-else>{{ user.id ? 'Atualizar' : 'Salvar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'UserForm',
    data() {
      return {
        user: {
          username: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          role: 'USER'
        },
        isLoading: false,
        errorMessage: null
      };
    },
    created() {
      const userId = this.$route.params.id;
      if (userId) {
        this.fetchUserDetails(userId);
      }
    },
    methods: {
      async fetchUserDetails(userId) {
        this.isLoading = true;
        try {
          const response = await api.get(`/users/${userId}`);
          this.user = response.data;
        } catch (error) {
          this.errorMessage = 'Erro ao carregar os dados do usuário.';
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      },
      async saveUser() {
        this.isLoading = true;
        this.errorMessage = null;
  
        try {
          if (this.user.id) {
            await api.put(`/users`, {id: this.user.id, ...this.user});
          } else {
            await api.post('/auth/register', this.user);
          }
          this.$router.push('/admin/users');
        } catch (error) {
          this.errorMessage = 'Erro ao salvar o usuário. Verifique os dados e tente novamente.';
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      },
      goBack() {
        this.$router.push('/admin/users');
      },
      isAdmin() {
        return localStorage.getItem('userRole') === 'ROLE_ADMIN';
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  </style>
  