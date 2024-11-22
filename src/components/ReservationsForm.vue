<template>
  <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
    <div v-if="reservation" class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ reservation.id ? 'Editar Reserva' : 'Adicionar Reserva' }}</h2>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="saveReservation" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="user">Usuário</label>
          <select v-model="reservation.userId" id="user"
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            required>
            <option disabled value="">Selecione um usuário</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.username }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="book">Livro</label>
          <select v-model="reservation.bookId" id="book"
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            required>
            <option disabled value="">Selecione um livro</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="status">Status</label>
          <select v-model="reservation.status" id="status"
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            required>
            <option disabled value="">Selecione um status</option>
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status === 'ACTIVE' ? 'Ativo' : 'Cancelado' }}
            </option>
          </select>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="goBack" type="button"
            class="bg-gray-400 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition duration-200">Cancelar</button>
          <button type="submit"
            class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'EditReservation',
  data() {
    return {
      reservation: {
        userId: null,
        bookId: null,
        status: 'ACTIVE',
      },
      users: [],
      books: [],
      isLoading: true,
      errorMessage: null,
      statusOptions: ['ACTIVE', 'CANCELLED'],
    };
  },
  created() {
    this.fetchReservationDetails();
    this.fetchUsers();
    this.fetchBooks();
  },
  methods: {
    async fetchReservationDetails() {
      const reservationId = this.$route.params.id;
      if (reservationId) {
        try {
          const response = await api.get(`/reservations/${reservationId}`);
          this.reservation = response.data;
          this.reservation.userId = this.reservation.user?.id || null;
          this.reservation.bookId = this.reservation.book?.id || null;
          this.reservation.status = this.reservation.status || null;
        } catch (error) {
          this.errorMessage = 'Erro ao buscar detalhes da reserva.';
          console.error('Erro ao buscar detalhes da reserva:', error);
        }
      }
    },
    async fetchUsers() {
      try {
        const response = await api.get('/users');
        this.users = response.data._embedded.userDtoList;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar usuários.';
        console.error('Erro ao buscar usuários:', error);
      }
    },
    async fetchBooks() {
      try {
        const response = await api.get('/books');
        this.books = response.data._embedded.bookDtoList;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar livros.';
        console.error('Erro ao buscar livros:', error);
      }
    },
    async saveReservation() {
      const reservationData = {
        user: { id: this.reservation.userId },
        book: { id: this.reservation.bookId },
        reservationDate: this.reservation.reservationDate,
        status: this.reservation.status,
      };
      
      try {
        if (this.reservation.id) {
          await api.put(`/reservations`, { id: this.reservation.id, ...reservationData });
        } else {
          await api.post(`/reservations`, reservationData);
        }
        this.$router.push('/admin/reservations'); 
      } catch (error) {
        this.errorMessage = 'Erro ao salvar a reserva. Tente novamente mais tarde.';
        console.error('Erro ao salvar a reserva:', error);
      }
    },
    goBack() {
      this.$router.push('/admin/reservations');
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
