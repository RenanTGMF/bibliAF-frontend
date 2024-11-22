<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-800">
    <div class="bg-gray-900 p-8 rounded shadow-md w-96">
      <h1 class="text-white text-2xl mb-6 text-center">Cadastrar</h1>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block text-gray-400" for="username">Nome</label>
          <input 
            v-model="username"
            type="text" 
            id="username" 
            required 
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400" for="email">Email</label>
          <input 
            v-model="email"
            type="text" 
            id="email" 
            required 
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white" 
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400" for="phone">Telefone</label>
          <input 
            v-model="phone"
            type="text" 
            id="phone" 
            v-mask="'(##) #####-####'"
            required 
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white" 
            placeholder="(00) 00000-0000"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-400" for="address">Endereço</label>
          <input 
            v-model="address"
            type="text" 
            id="address" 
            required 
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white" 
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-400" for="password">Senha</label>
          <input 
            v-model="password"
            type="password" 
            id="password" 
            required 
            class="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white" 
          />
        </div>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <span v-if="isLoading">Carregando...</span>
          <span v-else>Registrar</span>
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</p>
      <p class="text-gray-400 text-center mt-4">
        Já tem uma conta? <a href="/login" class="text-blue-400 hover:underline">Login</a>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'RegisterForm',
  data() {
    return {
      username: '',
      phone: '',
      address: '',
      email: '',
      password: '',
      role: 'USER',
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async register() {
      if (this.email && this.password) {
        this.isLoading = true;
        this.errorMessage = '';
        try {
          await api.post('/auth/register', {
            username: this.username,
            phone: this.phone,
            address: this.address,
            email: this.email,
            password: this.password,
            role: this.role
          });

          this.$router.push('/login'); 
        } catch (error) {
          if (error.response && error.response.status === 401) {
            this.errorMessage = 'Credenciais inválidas. Tente novamente.';
          }
          else if (error.response && error.response.status === 403) {
            this.errorMessage = 'Erro de autorização. Tente novamente.';
          }
          else {
            this.errorMessage = error.response?.data || 'Erro de conexão. Verifique sua rede e tente novamente.';
          }
          console.error(error);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.errorMessage = 'Por favor, preencha todos os campos.';
      }
    }
  }
};
</script>

<style scoped>
label, h1, button{
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-weight: bold;
}
p {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
</style>
