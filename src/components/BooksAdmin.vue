<template>
    <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
        <div >
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">BIBLIOTECA</h1>
      
      <div class="mb-6 flex justify-center">
        <button 
          @click="goToAddBook"
          class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-80 transition duration-200 font-bold"
        >
          Adicionar Livro
        </button>
     </div>
      </div>
      
      <div class="mb-6 flex justify-center items-center">
        <div class="relative w-full md:w-1/2 lg:w-1/3">
          <input
            v-model="searchQuery"
            @keyup.enter="searchBooks"
            type="text"
            placeholder="Pesquisar livros..."
            class="border border-gray-300 rounded-full p-3 pr-12 w-full shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition duration-200 text-secondary"
          />
          <button 
            @click="searchBooks" 
            class="absolute inset-y-0 right-0 flex items-center bg-secondary text-white px-4 py-2 rounded-full shadow-md hover:bg-opacity-90 transition duration-200 font-bold"
          >
            Buscar
          </button>
        </div>
      </div>
  
      <div v-if="books.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhum livro encontrado</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>
      
      <confirm-modal
      :isOpen="isModalOpen"
      :onConfirm="removeBook"
      :message="'Deseja remover este livro?'"
      @close="isModalOpen = false"
      />

    <div class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="book in books"
        :key="book.id"
        @click="goToBookDetails(book.id)"
        class="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 flex flex-col md:flex-row border border-gray-300 cursor-pointer"
      >
      <img 
        :src="book.image" 
        alt="Capa do Livro" 
        class="w-full h-full object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none sm:w-24 md:w-36 lg:w-44 xl:w-52"
      />
        <div class="flex-1 flex flex-col justify-between">
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-1">{{ book.title }}</h2>
            <p class="text-black font-bold">{{ book.author.name }}</p>
            <p class="text-gray-600 font-medium">{{ book.genre.name }}</p>
            <p class="text-gray-600 font-medium mt-2">Cópias: {{ book.copiesAvailable }}/{{ book.copies }}</p>
          </div>
          <div class="flex flex-col justify-end ">
            <button @click.stop="editBook(book.id)" class="bg-secondary text-white px-4 py-2 shadow hover:bg-opacity-80 transition duration-200">Editar</button>
            <button @click.stop="confirmRemoveBook(book.id)" class="bg-primary text-white px-4 py-2 shadow hover:bg-opacity-80 transition duration-200 rounded-br">Remover</button>
          </div>
        </div>
      </div>
    </div>
  
      <div v-if="totalPages > 1" class="mt-6 flex justify-center items-center space-x-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="bg-secondary text-white px-4 py-2 rounded-full shadow hover:bg-secondary transition duration-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <span class="text-lg">{{ currentPage + 1 }} de {{ totalPages }}</span>
        <button
          @click="nextPage"
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
  
    export default {
        name: 'BooksList',
        components: {
        ConfirmModal
    },
    data() {
        return {
        books: [],
        currentPage: 0,
        pageSize: 9,
        totalPages: 0,
        searchQuery: '',
        isModalOpen: false,
        bookIdToRemove: null
        };
    },
    created() {
        this.fetchBooks();
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await api.get(`/books?page=${this.currentPage}&size=${this.pageSize}`);
          this.books = response.data?._embedded?.bookDtoList || [];
          this.totalPages = response.data.page.totalPages;
        } catch (error) {
          console.error(error);
        }
      },
      async searchBooks() {
        if (this.searchQuery.trim() === '') {
          return this.fetchBooks();
        }
  
        try {
          const response = await api.get(`/books/find/title/${this.searchQuery}?page=${this.currentPage}&size=${this.pageSize}`);
          this.books = response.data?._embedded?.bookDtoList || [];
          this.totalPages = response.data.page.totalPages;
        } catch (error) {
          console.error(error);
        }
      },
      goToBookDetails(bookId) {
        this.$router.push(`/books/${bookId}`);
      },
      goToAddBook() {
        this.$router.push('/admin/add/book'); 
      },
      editBook(bookId) {
        this.$router.push(`/admin/edit/books/${bookId}`);
      },
      confirmRemoveBook(bookId) {
      this.bookIdToRemove = bookId; 
      this.isModalOpen = true; 
    },
    async removeBook() {
      if (this.bookIdToRemove) {
        try {
          await api.delete(`/books/${this.bookIdToRemove}`);
          this.fetchBooks(); 
        } catch (error) {
          console.error("Erro ao remover livro:", error);
        } finally {
          this.isModalOpen = false;
          this.bookIdToRemove = null;
        }
      }
    },
      prevPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
          this.fetchBooks();
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
          this.fetchBooks();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  input {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  
  button {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    transition: background-color 0.3s ease;
  }
  
  button:disabled {
    cursor: not-allowed;
  }
  
  span {
    margin: 0 12px;
    font-weight: 600;
  }
  </style>
  