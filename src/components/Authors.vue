<template>
  <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Lista de Autores</h1>
    
    <div class="mb-6 flex justify-center items-center">
        <div class="relative w-full md:w-1/2 lg:w-1/3">
          <input
            v-model="searchQuery"
            @keyup.enter="searchAuthors"
            type="text"
            placeholder="Pesquisar autores..."
            class="border border-gray-300 rounded-full p-3 pr-12 w-full shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition duration-200 text-secondary"
          />
          <button 
            @click="searchAuthors" 
            class="absolute inset-y-0 right-0 flex items-center bg-secondary text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-90 transition duration-200 font-bold"
          >
            Buscar
          </button>
        </div>
      </div>

    <div v-if="authors.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhum autor encontrado</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>
      

    <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      <div
        v-for="author in authors"
        :key="author.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col border border-gray-300 cursor-exchange"
      >
        <div class="p-4 flex-1">
          <h2 class="text-xl font-semibold text-secondary">{{ author.name }}</h2>
          <p class="mt-2 text-gray-700">{{ author.bio }}</p>
        </div>
        <button
          @click="$router.push(`/authors/${author.id}`)">
        <div class="p-4 bg-primary text-white text-center cursor-pointer">
          <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Ver Livros</label>
        </div>
      </button>
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

export default {
  name: 'AuthorsList',
  data() {
    return {
      authors: [],
      currentPage: 0,
      pageSize: 9,
      totalPages: 0,
      searchQuery: '',
    };
  },
  created() {
    this.fetchAuthors();
  },
  methods: {
    async fetchAuthors() {
        try {
          const response = await api.get(`/authors/paged?page=${this.currentPage}&size=${this.pageSize}`);
          this.authors = response.data?._embedded?.authorDtoList || [];
          this.totalPages = response.data?.page?.totalPages || 0; 
        } catch (error) {
          console.error(error);
        }
      },
    async searchAuthors() {
        if (this.searchQuery.trim() === '') {
          return this.fetchAuthors();
        }
        try {
          const response = await api.get(`/authors/find/name/${this.searchQuery}`);
          this.authors = response.data || [];
        } catch (error) {
          console.error(error);
        }
      },
      goToPage(pageNumber) {
        this.currentPage = pageNumber;
        this.fetchAuthors(); 
      },
  },
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc; /* Cor de fundo suave */
}

.bg-white {
  transition: box-shadow 0.3s ease;
}

.bg-white:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Sombra mais pronunciada ao passar o mouse */
}
</style>
