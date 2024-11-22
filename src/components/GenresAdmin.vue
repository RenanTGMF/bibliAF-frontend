<template>
    <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">

      <modal
        :isOpen="isErrorModalOpen"
        :title="'Erro ao remover Gênero!'"
        :message="errorMessage"
        @close="isErrorModalOpen = false"
      />

      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Lista de Gêneros</h1>
  
      <div class="mb-6 flex justify-center">
        <button 
          @click="goToAddGenre"
          class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-80 transition duration-200 font-bold"
        >
          Adicionar Gênero
        </button>
      </div>
  
      <div class="mb-6 flex justify-center items-center">
        <div class="relative w-full md:w-1/2 lg:w-1/3">
          <input
            v-model="searchQuery"
            @keyup.enter="searchGenres"
            type="text"
            placeholder="Pesquisar gêneros..."
            class="border border-gray-300 rounded-full p-3 pr-12 w-full shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition duration-200 text-secondary"
          />
          <button 
            @click="searchGenres" 
            class="absolute inset-y-0 right-0 flex items-center bg-secondary text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-90 transition duration-200 font-bold"
          >
            Buscar
          </button>
        </div>
      </div>
  
      <div v-if="genres.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhum gênero encontrado</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>
  
      <confirm-modal
        :isOpen="isModalOpen"
        :onConfirm="removeGenre"
        :message="'Deseja remover este gênero?'"
        @close="isModalOpen = false"
      />
  
      <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="genre in genres"
          :key="genre.id"
          @click="goToGenre(genre.id)"
          class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col border border-gray-300 cursor-pointer"
        >
          <div class="p-4 flex-1">
            <h2 class="text-xl font-semibold text-secondary">{{ genre.name }}</h2>
          </div>
          <div class="text-white text-center cursor-pointer flex flex-row justify-around">
            <button class="flex-1" @click.stop="$router.push(`/admin/edit/genres/${genre.id}`)">
              <div class="p-4 bg-secondary text-white text-center cursor-pointer hover:bg-opacity-80">
                <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Editar</label>
              </div>
            </button>
            <button class="flex-1" @click.stop="confirmRemoveGenre(genre.id)">
              <div class="p-4 bg-primary text-white text-center cursor-pointer hover:bg-opacity-80">
                <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Remover</label>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div v-if="totalPages > 0" class="mt-6 flex justify-center items-center space-x-4">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="bg-secondary text-white px-4 py-2 rounded-full shadow hover:bg-secondary transition duration-200 disabled:opacity-50"
      >
        Anterior
      </button>
      <span class="text-lg font-semibold">{{ currentPage + 1 }} de {{ totalPages }}</span>
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="bg-secondary text-white px-4 py-2 rounded-full shadow hover:bg-secondary transition duration-200 disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  import ConfirmModal from './Modal.vue';
  import Modal from './ModalConfirm.vue'
  
  export default {
    name: 'GenresList',
    components: {
      ConfirmModal,
      Modal
    },
    data() {
      return {
        genres: [],
        currentPage: 0,
        totalPages: 0,
        pageSize: 9,
        searchQuery: '',
        isModalOpen: false,
        isErrorModalOpen: false,
        genreIdToRemove: null,
        errorMessage: ''
      };
    },
    created() {
      this.fetchGenres();
    },
    methods: {
      async fetchGenres() {
        try {
          const response = await api.get(`/genres/paged?page=${this.currentPage}&size=${this.pageSize}`);
          this.genres = response.data?._embedded?.genreDtoList || [];
          this.totalPages = response.data?.page?.totalPages || 0; 
        } catch (error) {
          console.error(error);
        }
      },
      goToPage(pageNumber) {
        this.currentPage = pageNumber;
        this.fetchGenres(); 
      },
      async searchGenres() {
        if (this.searchQuery.trim() === '') {
          return this.fetchGenres();
        }
        try {
          const response = await api.get(`/genres/find/name/${this.searchQuery}`);
          this.genres = response.data || [];
        } catch (error) {
          console.error(error);
        }
      },
      goToAddGenre() {
        this.$router.push('/admin/add/genre');
      },
      goToGenre(genreId) {
        this.$router.push(`/genres/${genreId}`);
      },
      confirmRemoveGenre(genreId) {
        this.genreIdToRemove = genreId; 
        this.isModalOpen = true; 
      },
      async removeGenre() {
        if (this.genreIdToRemove) {
          try {
            await api.delete(`/genres/${this.genreIdToRemove}`);
            this.fetchGenres(); 
          } catch (error) {
            this.isErrorModalOpen = true;
            this.errorMessage = error.response?.data?.message || 'Erro ao remover gênero.';
          } finally {
            this.isModalOpen = false;
            this.genreIdToRemove = null;
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .bg-white {
    transition: box-shadow 0.3s ease;
  }
  
  .bg-white:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  button {
    transition: all 0.2s ease;
  }
  
  button:hover {
    background-color: #f0f4f8;
  }
  </style>
  