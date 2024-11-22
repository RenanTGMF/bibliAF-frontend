<template>
  <div class="p-6 md:p-10 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen flex items-center justify-center">
    <div v-if="loan" class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 class="text-2xl font-bold text-center mb-6 text-primary">{{ loan.id ? 'Editar Empréstimo' : 'Adicionar Empréstimo' }}</h2>

      <div v-if="errorMessage" class="mt-4 text-red-500">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="saveLoan" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="user">Usuário</label>
          <select 
            v-model="loan.userId" 
            id="user" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          >
            <option disabled value="">Selecione um usuário</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.username }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="book">Livro</label>
          <select 
            v-model="loan.bookId" 
            id="book" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          >
            <option disabled value="">Selecione um livro</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="loanDate">Data do Empréstimo</label>
          <input 
            v-model="loan.loanDate" 
            type="date" 
            id="loanDate" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="returnDate">Data de Devolução</label>
          <input 
            v-model="loan.returnDate" 
            type="date" 
            id="returnDate" 
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200" 
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 font-semibold mb-2" for="status">Status</label>
          <select v-model="loan.status" id="status"
            class="w-full border border-gray-300 rounded-md p-3 focus:border-primary focus:ring focus:ring-primary-light focus:outline-none transition duration-200"
            required>
            <option disabled value="">Selecione um status</option>
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status === 'OVERDUE' ? 'Atrasado' : status === 'PENDING' ? 'Em andamento' : 'Devolvido' }}
            </option>
          </select>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button @click="goBack" type="button" class="bg-gray-400 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition duration-200">Cancelar</button>
          <button type="submit" class="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary-dark transition duration-200">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'EditLoan',
  data() {
    return {
      loan: null,
      users: [],
      books: [],
      isLoading: true,
      errorMessage: null,
      statusOptions: ['PENDING', 'OVERDUE', 'RETURNED'],
      status: 'PENDING',
    };
  },
  created() {
    this.fetchLoanDetails();
    this.fetchUsers();
    this.fetchBooks();
  },
  methods: {
    async fetchLoanDetails() {
      const loanId = this.$route.params.id;
      if (loanId) {
        try {
          const response = await api.get(`/loans/${loanId}`);
          this.loan = response.data;
          this.loan.userId = this.loan.user.id; 
          this.loan.bookId = this.loan.book.id;
          this.loan.loanDate = this.formatDate(this.loan.loanDate);
          this.loan.returnDate = this.formatDate(this.loan.returnDate);
          this.loan.status = this.loan.status || 'PENDING';
        } catch (error) {
          this.errorMessage = 'Erro ao buscar detalhes do empréstimo.';
          console.error('Erro ao buscar detalhes do empréstimo:', error);
        }
      } else {
        this.resetLoan();
      }
    },
    resetLoan() {
      this.loan = {
        userId: null,
        bookId: null,
        loanDate: '',
        returnDate: '',
        status: 'PENDING'
      };
    },
    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await api.get('/users');
        this.users = response.data._embedded.userDtoList; 
      } catch (error) {
        this.errorMessage = 'Erro ao buscar usuários.';
        console.error('Erro ao buscar usuários:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchBooks() {
      this.isLoading = true;
      try {
        const response = await api.get('/books');
        this.books = response.data._embedded.bookDtoList;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar livros.';
        console.error('Erro ao buscar livros:', error);
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateString) {
        return dateString.split('T')[0].split('/').reverse().join('/');
      },
    async saveLoan() {
      const loanData = {
        user: { id: this.loan.userId },
        book: { id: this.loan.bookId },
        loanDate: this.loan.loanDate,
        returnDate: this.loan.returnDate,
        status: this.loan.status,
      };
      console.log(loanData)
      try {
        if (this.loan.id) {
          await api.put('/loans', { id: this.loan.id, ...loanData });
        } else {
          await api.post('/loans', loanData);
        }
        this.$router.push('/admin/loans'); 
      } catch (error) {
        this.errorMessage = 'Erro ao salvar o empréstimo. Tente novamente mais tarde.';
        console.error('Erro ao salvar o empréstimo:', error);
      }
    },
    goBack() {
      this.$router.push('/admin/loans');
    },
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
