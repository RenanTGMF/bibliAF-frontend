<template>
  <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">

    <confirm-modal
      :isOpen="isModalOpen"
      :title="'Livro reservado com sucesso!'"
      :message="'Entraremos em contato quando o livro estiver disponível para empréstimo.'"
      @close="isModalOpen = false"
      />

    <div v-if="book" class="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center max-w-4xl w-full">
      <img 
        :src="book.image" 
        alt="Capa do Livro" 
        class="w-56 h-80 object-cover rounded-md mb-6 md:mb-0 md:mr-8 shadow-md transition-transform transform hover:scale-105" 
      />
      <div class="flex-1">
        <h2 class="text-2xl md:text-4xl font-bold mb-2 md:mb-2 text-primary">{{ book.title }}</h2>
        <p class="text-md md:text-lg text-black font-bold">{{ book.author.name }}</p>
        <p class="text-md md:text-lg text-gray-600 font-medium mb-3">{{ book.genre.name }}</p>

        <p class="text-md md:text-lg text-gray-600 text-justify">
          <span class="font-semibold">{{ summaryText }}</span>
          <button
            v-if="isLongSummary"
            @click="toggleSummary"
            class="text-primary font-bold ml-2 focus:outline-none"
          >
            {{ showFullSummary ? 'Ver menos' : 'Ver mais' }}
          </button>
        </p>
        <div class="flex flex-col md:flex-row justify-end mt-4">
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
</template>

<script>
import api from '../api';
import ConfirmModal from './ModalConfirm.vue';

export default {
  name: 'BookDetails',
  components: {
    ConfirmModal
  },
  data() {
    return {
      book: null,
      showFullSummary: false,
      isModalOpen: false,
      userReservations: [], 
    };
  },
  computed: {
    summaryText() {
      if (!this.book || !this.book.summary) return '';
      return this.showFullSummary || this.book.summary.length <= 200
        ? this.book.summary
        : `${this.book.summary.slice(0, 200)}...`;
    },
    isLongSummary() {
      return this.book && this.book.summary && this.book.summary.length > 200;
    },
  },
  created() {
    this.fetchBookDetails();
    this.fetchUserReservations();
  },
  methods: {
    async fetchBookDetails() {
      const bookId = this.$route.params.id;
      try {
        const response = await api.get(`/books/${bookId}`);
        this.book = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    toggleSummary() {
      this.showFullSummary = !this.showFullSummary;
    },
    async fetchUserReservations() {
      try {
        const response = await api.get(`/reservations/find/user/${localStorage.getItem('userId')}`);
        this.userReservations = response.data._embedded?.reservationDtoList || [];
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
    goBack() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
