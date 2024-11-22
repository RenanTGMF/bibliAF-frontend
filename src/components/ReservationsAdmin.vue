<template>
  <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Lista de Reservas</h1>

    <div class="mb-6 flex justify-center">
      <button 
        @click="goToAddReservation"
        class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-opacity-80 transition duration-200 font-bold"
      >
        Adicionar Reserva
      </button>
    </div>

    <div v-if="reservations.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhuma reserva encontrada</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>

    <confirm-modal
      :isOpen="isModalOpen"
      :onConfirm="removeReservation"
      :message="'Deseja remover esta reserva?'"
      @close="isModalOpen = false"
    />

    <div v-if="reservations.length !== 0" class="overflow-x-auto mb-8 hidden lg:block">
      <table class="min-w-full bg-white rounded-lg shadow-lg">
        <thead class="bg-gray-200 text-center">
          <tr>
            <th @click="sort('book.title')" class="cursor-pointer p-4 border-b">Livro <span v-if="sortKey === 'book.title'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('user.username')" class="cursor-pointer p-4 border-b">Usuário <span v-if="sortKey === 'user.username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th @click="sort('reservationDate')" class="cursor-pointer p-4 border-b">Data de Reserva <span v-if="sortKey === 'reservationDate'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
            <th class="p-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in sortedReservations" :key="reservation.id" class="hover:bg-gray-100">
            <td class="p-4 border-b text-center">{{ reservation.book.title }}</td>
            <td class="p-4 border-b text-center">{{ reservation.user.username }}</td>
            <td class="p-4 border-b text-center">{{ formatDate(reservation.reservationDate) }}</td>
            <td class="p-4 border-b text-center">
              <button @click.stop="$router.push(`/admin/edit/reservations/${reservation.id}`)" class="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80">Editar</button>
              <button @click.stop="confirmRemoveReservation(reservation.id)" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 ml-2">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="reservations.length !== 0" class="lg:hidden mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="reservation in reservations"
        :key="reservation.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col border border-gray-300 cursor-pointer"
      >
        <div class="p-4 flex-1">
          <h2 class="text-xl font-semibold text-secondary">{{ reservation.book.title }}</h2>
          <p class="mt-2 text-gray-700"><strong>Usuário:</strong> {{ reservation.user.username }}</p>
          <p class="mt-2 text-gray-700"><strong>Data de Reserva:</strong> {{ formatDate(reservation.reservationDate) }}</p>
        </div>
        <div class="text-white text-center cursor-pointer flex flex-row justify-around">
          <button class="flex-1" @click.stop="$router.push(`/admin/edit/reservations/${reservation.id}`)">
            <div class="p-4 bg-secondary text-white text-center cursor-pointer hover:bg-opacity-80">
              <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Editar</label>
            </div>
          </button>
          <button class="flex-1" @click.stop="confirmRemoveReservation(reservation.id)">
            <div class="p-4 bg-primary text-white text-center cursor-pointer hover:bg-opacity-80">
              <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Remover</label>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import ConfirmModal from './Modal.vue';

export default {
  name: 'ReservationsList',
  components: {
    ConfirmModal
  },
  data() {
    return {
      reservations: [],
      isModalOpen: false,
      reservationIdToRemove: null,
      sortKey: '',
      sortOrder: 'asc',
    };
  },
  created() {
    this.fetchReservations();
  },
  computed: {
    sortedReservations() {
      const reservationsCopy = [...this.reservations];
      return reservationsCopy.sort((a, b) => {
        const modifier = this.sortOrder === 'asc' ? 1 : -1;
        const aValue = a[this.sortKey];
        const bValue = b[this.sortKey];
        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    }
  },
  methods: {
    async fetchReservations() {
      try {
        const response = await api.get('/reservations');
        this.reservations = response.data?._embedded?.reservationDtoList || [];
      } catch (error) {
        console.error(error);
      }
    },
    goToAddReservation() {
      this.$router.push('/admin/add/reservation');
    },
    confirmRemoveReservation(reservationId) {
      this.reservationIdToRemove = reservationId;
      this.isModalOpen = true;
    },
    async removeReservation() {
      if (this.reservationIdToRemove) {
        try {
          await api.delete(`/reservations/${this.reservationIdToRemove}`);
          this.fetchReservations();
        } catch (error) {
          console.error("Erro ao remover Reserva:", error);
        } finally {
          this.isModalOpen = false;
          this.reservationIdToRemove = null;
        }
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pt-BR');
    },
    sort(key) {
      this.sortOrder = this.sortKey === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortKey = key;
    }
  }
};
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}

.bg-white {
  transition: box-shadow 0.3s ease;
}

.bg-white:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:bg-opacity-80:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Adicionando bordas entre as células e cartões */
table td{
  border: 1px solid #e2e8f0; /* Adiciona borda às células da tabela */
  text-align: center;
}

table th{
  border: 1px solid #d5dbe3; /* Adiciona borda às células da tabela */
  align-items: center;
  background-color: #f0f0f0;
}

.card {
  border: 1px solid #e2e8f0; /* Borda nos cartões da visualização móvel */
}
</style>
