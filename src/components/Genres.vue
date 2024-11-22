<template>
  <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Lista de Gêneros</h1>

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
            class="absolute inset-y-0 right-0 flex items-center bg-secondary text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-80 transition duration-200 font-bold"
          >
            Buscar
          </button>
        </div>
      </div>

    <div v-if="genres.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhum gênero encontrado</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>

    <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="genre in genres"
        :key="genre.id"
        @click="goToGenre(genre.id)"
        class="bg-white rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 border border-gray-300 cursor-pointer flex flex-col items-center"
      >
        <h2 class="text-xl font-semibold p-2text-center text-secondary">{{ genre.name }}</h2>
      </button>
    </div>
    <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
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

export default {
  name: 'GenresList',
  data() {
    return {
      genres: [],
      currentPage: 0,
      totalPages: 0,
      pageSize: 12,
      searchQuery: '',
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
    async searchGenres() {
        if (this.searchQuery.trim() === '') {
          return this.fetchGenres();
        }
        try {
          const response = await api.get(`/genres/find/name/${this.searchQuery}`);
          this.genres = response.data || [];
          this.totalPages = 0;
          this.currentPage = 0;
        } catch (error) {
          console.error(error);
        }
      },
    goToGenre(genreId) {
      this.$router.push(`/genres/${genreId}`);
    },
    goToPage(pageNumber) {
        this.currentPage = pageNumber;
        this.fetchGenres(); 
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
