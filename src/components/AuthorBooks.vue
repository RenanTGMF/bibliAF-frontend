<template>
    <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">

      <confirm-modal
      :isOpen="isModalOpen"
      :title="'Livro reservado com sucesso!'"
      :message="'Entraremos em contato quando o livro estiver disponível para empréstimo.'"
      @close="isModalOpen = false"
      />

      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">{{ authorName }}</h1>
      <div v-if="books.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
    <p class="text-2xl font-semibold text-gray-700">Nenhum livro encontrado</p>
    <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
  </div>
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
          class="w-full h-72 object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none md:w-48" 
        />
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-1">{{ book.title }}</h2>
            <p class="text-black font-bold">{{ book.author.name }}</p>
            <p class="text-gray-600 font-medium">{{ book.genre.name }}</p>
          </div>
          <div class="flex justify-end">
            <button 
              @click.stop="reserveBook(book.id)" 
              :class="{'bg-gray-400': isReserved(book.id), 'bg-primary': !isReserved(book.id)}"
              :disabled="isReserved(book.id)"
              class="text-white px-4 py-2 rounded shadow hover:bg-opacity-80 transition duration-200"
            >
              {{ isReserved(book.id) ? 'Reservado' : 'Reservar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-center items-center space-x-4"
        v-if ="totalPages > 1"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 0"
        class="bg-secondary text-white px-4 py-2 rounded-full shadow hover:bg-secondary transition duration-200 disabled:opacity-50"
      >
        Anterior
      </button>
      <span class="text-lg">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
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
  import ConfirmModal from './ModalConfirm.vue';
  
  export default {
    name: 'AuthorsBooks',
    components: {
      ConfirmModal
    },
    data() {
      return {
        books: [],
        currentPage: 0,
        pageSize: 9,
        totalPages: 0,
        authorName: '',
        isModalOpen: false,
        userReservations: [], 
      };
    },
    created() {
      this.fetchBooks();
      this.fetchUserReservations();
    },
    methods: {
      async fetchBooks() {
        try {
          const response = await api.get(`/books/find/author/${this.$route.params.id}?page=${this.currentPage}&size=${this.pageSize}`);
          this.books = response.data?._embedded?.bookDtoList || [];
          this.totalPages = response.data?.page?.totalPages || 0; 
          this.authorName = response.data?._embedded?.bookDtoList[0]?.author?.name || '';
        } catch (error) {
          console.error(error);
        }
      },
      goToBookDetails(bookId) {
        this.$router.push(`/books/${bookId}`);
      },
      async fetchUserReservations() {
      try {
        const response = await api.get(`/reservations/find/user/${localStorage.getItem('userId')}`);
        this.userReservations = response.data?._embedded?.reservationDtoList || [];
      } catch (error) {
        console.error(error);
      }
    },
    isReserved(bookId) {
      return this.userReservations.some(reservation => reservation.book.id === bookId);
    },
      async reserveBook(bookId) {
      const reservationData = {
        book: {
          id: bookId,
        },
        user: {
          id: localStorage.getItem('userId'),
        },
      };

      try {
        await api.post(`/reservations`, reservationData);
        this.isModalOpen = true;
        this.fetchUserReservations();
      } catch (error) {
        console.error(error);
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
  button {
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