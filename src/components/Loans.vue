<template>
  <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Gerenciar Empréstimos</h1>

    <div v-if="loans.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
      <p class="text-2xl font-semibold text-gray-700">Nenhum empréstimo encontrado</p>
      <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
    </div>

    <div v-else>
      <div v-for="status in ['OVERDUE', 'PENDING', 'RETURNED']" :key="status" class="mb-8">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'LoansList',
  data() {
    return {
      loans: [],
      sortKey: '',
      sortOrder: 'asc',
    };
  },
  created() {
    this.fetchLoans();
  },
  computed: {
    sortedLoans() {
      const loansCopy = [...this.loans];
      return loansCopy.sort((a, b) => {
        const modifier = this.sortOrder === 'asc' ? 1 : -1;
        const aValue = this.sortKey.includes('.') ? a[this.sortKey.split('.')[0]][this.sortKey.split('.')[1]] : a[this.sortKey];
        const bValue = this.sortKey.includes('.') ? b[this.sortKey.split('.')[0]][this.sortKey.split('.')[1]] : b[this.sortKey];

        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return (aValue - bValue) * modifier;
      });
    },
  },
  methods: {
    async fetchLoans() {
      try {
        const response = await api.get('/loans/find/user/' + localStorage.getItem('userId'));
        this.loans = response.data?._embedded?.loanDtoList || [];
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateString) {
      return dateString.split('T')[0].replace(/-/g, '/').split('/').reverse().join('/');
    },
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    filteredLoans(status) {
      return this.loans.filter(loan => loan.status === status);
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f0f0f0;
  text-align: left;
  border: 1px solid #d5dbe3;
  text-align: center;
}

th:hover {
  background-color: #e0e0e0;
}

td {
  border: 1px solid #e2e8f0;
  align-items: center;
}
</style>
