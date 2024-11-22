<template>
    <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
      <div v-if="author" class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ author.id ? 'Editar Autor' : 'Adicionar Autor' }}</h2>
        
        <div v-if="errorMessage" class="mt-4 text-red-500">
          {{ errorMessage }}
        </div>
  
        <form @submit.prevent="saveAuthor" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="name">Nome</label>
            <input 
              v-model="author.name" 
              type="text" 
              id="name" 
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
              required 
              placeholder="Digite o Nome do Autor"
            />
          </div>
  
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="bio">Biografia</label>
            <textarea 
              v-model="author.bio" 
              id="bio" 
              rows="4" 
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
              placeholder="Digite a Biografia do Autor (máx. 500 caracteres)"
            ></textarea>
          </div>
  
          <div class="mt-6 flex justify-end space-x-4">
            <button @click="goBack" type="button" class="bg-gray-400 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition duration-200">Cancelar</button>
            <button type="submit" class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    name: 'EditAuthor',
    data() {
      return {
        author: null,
        isLoading: true,
        errorMessage: null,
      };
    },
    created() {
      this.fetchAuthorDetails();
    },
    methods: {
      async fetchAuthorDetails() {
        const authorId = this.$route.params.id;
        if (authorId) {
          try {
            const response = await api.get(`/authors/${authorId}`);
            this.author = response.data;
          } catch (error) {
            this.errorMessage = 'Erro ao buscar detalhes do autor.';
            console.error('Erro ao buscar detalhes do autor:', error);
          }
        } else {
          this.resetAuthor();
        }
      },
      resetAuthor() {
        this.author = {
          name: '',
          bio: ''
        };
      },
    async saveAuthor() {
        const authorData = {
          name: this.author.name,
          bio: this.author.bio
        };
        
        try {
          if (this.author.id) {
            await api.put(`/authors`, { id: this.author.id, ...authorData });
          } else {
            await api.post(`/authors`, authorData);
          }
          this.$router.push('/admin/authors'); 
        } catch (error) {
          this.errorMessage = 'Erro ao salvar o autor. Tente novamente mais tarde.';
          console.error('Erro ao salvar o autor:', error);
        }
      },
      goBack() {
        this.$router.push('/admin/authors');
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  </style>
  