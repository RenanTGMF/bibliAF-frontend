<template>
  <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Gerenciar Empréstimos</h1>

    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      <div class="flex gap-4 flex-wrap">
        <input
          v-model="searchUser"
          type="text"
          placeholder="Buscar por usuário"
          class="p-2 border rounded lg:w-64 w-full"
        />
        <input
          v-model="searchBook"
          type="text"
          placeholder="Buscar por livro"
          class="p-2 border rounded lg:w-64 w-full"
        />
        <input
          v-model="searchDate"
          type="date"
          placeholder="Buscar por data de empréstimo"
          class="p-2 border rounded w-full lg:w-auto"
        />
         <select v-model="filterStatus" class="p-2 border rounded lg:w-64 w-full">
          <option value="">Todos os status</option>
          <option value="OVERDUE">Atrasados</option>
          <option value="PENDING">Em andamento</option>
          <option value="RETURNED">Devolvidos</option>
        </select>
      </div>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0">
    <router-link to="/admin/add/loan"
        class="justify-center inline-flex align-center px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-opacity-80 transition duration-200">
        Fazer Empréstimo
      </router-link>
    </div>

    <div v-if="loans.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
      <p class="text-2xl font-semibold text-gray-700">Nenhum empréstimo encontrado</p>
      <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
    </div>

    <div v-else>
      <div v-for="status in filteredStatuses" :key="status" class="mb-8">
        <div v-if="filteredLoans(status).length > 0">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ status === 'OVERDUE' ? 'Atrasados' : status === 'PENDING' ? 'Em andamento' : 'Devolvidos' }}
          </h2>

          <div class="hidden lg:block">
            <div v-if="filteredLoans(status).length" class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead>
                  <tr class="bg-gray-200 text-center">
                    <th @click="sort('id')" class="cursor-pointer p-4">Empréstimo <span v-if="sortKey === 'id'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th @click="sort('user.username')" class="cursor-pointer p-4">Usuário <span v-if="sortKey === 'user.username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th @click="sort('book.title')" class="cursor-pointer p-4">Livro <span v-if="sortKey === 'book.title'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th @click="sort('loanDate')" class="cursor-pointer p-4">Data de Empréstimo <span v-if="sortKey === 'loanDate'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th @click="sort('returnDate')" class="cursor-pointer p-4 hidden md:table-cell">Data de Devolução <span v-if="sortKey === 'returnDate'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th @click="sort('status')" class="cursor-pointer p-4">Status <span v-if="sortKey === 'status'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                    <th class="p-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="loan in filteredLoans(status)" :key="loan.id" class="hover:bg-gray-100">
                    <td class="p-4 border-b text-center">{{ loan.id }}</td>
                    <td class="p-4 border-b text-center">{{ loan.user.username }}</td>
                    <td class="p-4 border-b text-center">{{ loan.book.title }}</td>
                    <td class="p-4 border-b text-center">{{ formatDate(loan.loanDate) }}</td>
                    <td class="p-4 border-b text-center hidden md:table-cell">{{ formatDate(loan.returnDate) }}</td>
                    <td class="p-4 border-b text-center">{{ loan.status === 'OVERDUE' ? 'Atrasado' : loan.status === 'PENDING' ? 'Em andamento' : 'Devolvido' }}</td>
                    <td class="p-2 border-b text-center flex flex-col gap-1">
                      <router-link :to="`/admin/edit/loans/${loan.id}`"
                        class="inline-flex items-center px-4 py-2 bg-secondary text-white justify-center rounded hover:bg-opacity-80 transition duration-200">
                        Editar
                      </router-link>
                      <button @click="confirmRemoveLoan(loan.id)"
                        class="inline-flex items-center px-4 py-2 bg-primary text-white justify-center rounded hover:bg-opacity-80 transition duration-200">
                        Remover
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-if="filteredLoans(status).length > 0">
          <div v-for="loan in filteredLoans(status)" :key="loan.id" class="lg:hidden mt-6 grid gap-6">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col border border-gray-300 cursor-pointer">
              <div class="p-4 flex-1">
                <h2 class="text-xl font-semibold text-secondary">{{ loan.book.title }}</h2>
                <p class="mt-2 text-gray-700"><strong>Usuário:</strong> {{ loan.user.username }}</p>
                <p class="mt-2 text-gray-700"><strong>Data de Empréstimo:</strong> {{ formatDate(loan.loanDate) }}</p>
                <p v-if="loan.returnDate" class="mt-2 text-gray-700"><strong>Data de Devolução:</strong> {{ formatDate(loan.returnDate) }}</p>
                <p class="mt-2 text-gray-700"><strong>Status:</strong> {{ loan.status === 'OVERDUE' ? 'Atrasado' : loan.status === 'PENDING' ? 'Em andamento' : 'Devolvido' }}</p>
              </div>
              <div class="text-white text-center cursor-pointer flex flex-row justify-around">
                <button class="flex-1" @click.stop="$router.push(`/admin/edit/loans/${loan.id}`)">
                  <div class="p-4 bg-secondary text-white text-center cursor-pointer hover:bg-opacity-80">
                    <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Editar</label>
                  </div>
                </button>
                <button class="flex-1" @click.stop="confirmRemoveLoan(loan.id)">
                  <div class="p-4 bg-primary text-white text-center cursor-pointer hover:bg-opacity-80">
                    <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Remover</label>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirm-modal
      :isOpen="isModalOpen"
      :onConfirm="removeLoan"
      :message="'Deseja realmente remover este empréstimo?'"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script>
import api from '../api';
import ConfirmModal from './Modal.vue';

export default {
  name: 'LoansAdmin',
  components: {
    ConfirmModal,
  },
  data() {
    return {
      loans: [],
      searchUser: '',
      searchBook: '',
      searchDate: '',
      filterStatus: '',
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      loanToDelete: null,
    };
  },
  computed: {
    filteredStatuses() {
      return ['OVERDUE', 'PENDING', 'RETURNED'];
    },
  },
  methods: {
    async fetchLoans() {
      try {
        const response = await api.get('/loans');
        this.loans = response.data?._embedded?.loanDtoList || [];
      } catch (error) {
        console.error(error);
      }
    },
    filteredLoans(status) {
      let loans = this.loans.filter(loan => (status ? loan.status === status : true));
      if (this.searchUser) {
        loans = loans.filter(loan => loan.user.username.toLowerCase().startsWith(this.searchUser.toLowerCase()));
      }
      if (this.searchBook) {
        loans = loans.filter(loan => loan.book.title.toLowerCase().startsWith(this.searchBook.toLowerCase()));
      }
      if (this.searchDate) {
            loans = loans.filter(loan => {
            const formattedLoanDate = this.formatDate(loan.loanDate);
            const formattedReturnDate = this.formatDate(loan.returnDate);
            return formattedLoanDate.startsWith(this.formatDate(this.searchDate)) || formattedReturnDate.startsWith(this.formatDate(this.searchDate));
          });
      }
      if (this.filterStatus) {
        loans = loans.filter(loan => loan.status === this.filterStatus);
      }
      return loans;
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0].split('-').reverse().join('/');
    },
    sort(key) {
      this.sortKey = key;
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    confirmRemoveLoan(loanId) {
      this.loanToDelete = loanId;
      this.isModalOpen = true;
    },
    async removeLoan() {
      try {
        await api.delete(`/loans/${this.loanToDelete}`);
        this.loans = this.loans.filter(loan => loan.id !== this.loanToDelete);
        this.isModalOpen = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchLoans();
  },
};
</script>

<style scoped>
</style>
