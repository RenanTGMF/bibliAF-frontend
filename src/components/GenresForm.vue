<template>
    <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
      <div v-if="genre" class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ genre.id ? 'Editar Gênero' : 'Adicionar Gênero' }}</h2>
  
        <div v-if="errorMessage" class="mt-4 text-red-500">
          {{ errorMessage }}
        </div>
  
        <form @submit.prevent="saveGenre" class="space-y-4">
          <div>
            <label class="block text-gray-700 font-semibold mb-2" for="name">Nome</label>
            <input 
              v-model="genre.name" 
              type="text" 
              id="name" 
              class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
              required 
              placeholder="Digite o Nome do Gênero"
            />
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
    name: 'EditGenre',
    data() {
      return {
        genre: null,
        isLoading: true,
        errorMessage: null,
      };
    },
    created() {
      this.fetchGenreDetails();
    },
    methods: {
      async fetchGenreDetails() {
        const genreId = this.$route.params.id;
        if (genreId) {
          try {
            const response = await api.get(`/genres/${genreId}`);
            this.genre = response.data;
          } catch (error) {
            this.errorMessage = 'Erro ao buscar detalhes do gênero.';
            console.error('Erro ao buscar detalhes do gênero:', error);
          }
        } else {
          this.resetGenre();
        }
      },
      resetGenre() {
        this.genre = {
          name: '',
          bio: ''
        };
      },
    async saveGenre() {
        const genreData = {
          name: this.genre.name,
        };
        
        try {
          if (this.genre.id) {
            await api.put(`/genres`, { id: this.genre.id, ...genreData });
          } else {
            await api.post(`/genres`, genreData);
          }
          this.$router.push('/admin/genres'); 
        } catch (error) {
          this.errorMessage = 'Erro ao salvar o gênero. Tente novamente mais tarde.';
          console.error('Erro ao salvar o gênero:', error);
        }
      },
      goBack() {
        this.$router.push('/admin/genres');
      },
    },
  };
  </script>
  
  <style scoped>
  button {
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  </style>
  