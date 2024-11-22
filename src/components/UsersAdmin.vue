<template>
    <div class="p-6 bg-gradient-to-b from-blue-50 to-blue-200 min-h-screen">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Gerenciar Usuários</h1>
  
      <div class="text-center mb-6 flex flex-row gap-4 justify-center">
        <router-link to="/admin/add/user"
          class="inline-flex items-center px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-opacity-80 transition duration-200">
          Adicionar Usuário
        </router-link>
        <div>
        <button
          @click="logout"
          class="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
        >
          Deslogar
        </button>
      </div>

      </div>
     
      <div v-if="users.length === 0" class="text-center text-gray-600 text-lg flex flex-col items-center mt-10">
        <p class="text-2xl font-semibold text-gray-700">Nenhum usuário encontrado</p>
        <p class="text-gray-500 mt-2">Tente ajustar a pesquisa ou explorar outras categorias.</p>
      </div>
  
      <div v-else>
        <div class="overflow-x-auto mb-8 hidden md:block">
          <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
            <thead>
              <tr class="bg-gray-200 text-center">
                <th @click="sort('id')" class="cursor-pointer p-4">ID <span v-if="sortKey === 'id'">{{ sortOrder
                  === 'asc' ? '↑' : '↓' }}</span></th>
                <th @click="sort('username')" class="cursor-pointer p-4">Usuário <span v-if="sortKey === 'username'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th @click="sort('email')" class="cursor-pointer p-4">E-mail <span v-if="sortKey === 'email'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th @click="sort('phone')" class="cursor-pointer p-4">Telefone <span v-if="sortKey === 'phone'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th @click="sort('address')" class="cursor-pointer p-4">Endereço <span v-if="sortKey === 'address'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th @click="sort('address')" class="cursor-pointer p-4">Cargo <span v-if="sortKey === 'address'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span></th>
                <th class="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in sortedUsers" :key="user.id" class="hover:bg-gray-100">
                <td class="p-4 border-b text-center">{{ user.id }}</td>
                <td class="p-4 border-b text-center">{{ user.username }}</td>
                <td class="p-4 border-b text-center">{{ user.email }}</td>
                <td class="p-4 border-b text-center">{{ user.phone }}</td>
                <td class="p-4 border-b text-center">{{ user.address }}</td>
                <td class="p-4 border-b text-center">{{ user.role === 'ADMIN' ? 'ADMINISTRADOR': 'USUÁRIO' }}</td>
                <td class="p-4 border-b text-center">
                  <router-link :to="`/admin/edit/users/${user.id}`"
                    class="inline-flex items-center px-4 py-2 bg-secondary text-white rounded hover:bg-opacity-80 transition duration-200">
                    Editar
                  </router-link>
                  <button v-if="user.role !== 'ADMIN'" @click="confirmRemoveUser(user.id)"
                    class="inline-flex items-center px-4 py-2 ml-2 bg-primary text-white rounded hover:bg-opacity-80 transition duration-200">
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="lg:hidden mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="user in sortedUsers" :key="user.id"
            class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 flex flex-col border border-gray-300 cursor-pointer">
            <div class="p-4 flex-1">
              <h2 class="text-xl font-semibold text-secondary">{{ user.username }}</h2>
              <p class="mt-2 text-gray-700"><strong>E-mail:</strong> {{ user.email }}</p>
              <p class="mt-2 text-gray-700"><strong>Telefone:</strong> {{ user.phone }}</p>
              <p class="mt-2 text-gray-700"><strong>Endereço:</strong> {{ user.address }}</p>
              <p class="mt-2 text-gray-700"><strong>Cargo:</strong> {{ user.role }}</p>
            </div>
            <div class="text-white text-center cursor-pointer flex flex-row justify-around">
              <button class="flex-1" @click.stop="$router.push(`/admin/edit/users/${user.id}`)">
                <div class="p-4 bg-secondary text-white text-center cursor-pointer hover:bg-opacity-80">
                  <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Editar</label>
                </div>
              </button>
              <button v-if="user.role !== 'ADMIN'" class="flex-1" @click.stop="confirmRemoveUser(user.id)">
                <div class="p-4 bg-primary text-white text-center cursor-pointer hover:bg-opacity-80">
                  <label class="hover:bg-opacity-80 font-semibold cursor-pointer">Remover</label>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <confirm-modal
        :isOpen="isModalOpen"
        :onConfirm="removeUser"
        :message="'Deseja realmente remover este usuário?'"
        @close="isModalOpen = false"
      />

      <modal
        :isOpen="isErrorModalOpen"
        :title="'Erro ao remover o usuário'"
        :message="errorMessage"
        @close="isErrorModalOpen = false"
      />
    </div>
  </template>
  
  <script>
  import api from '../api';
  import ConfirmModal from './Modal.vue';
  import Modal from './ModalConfirm.vue'

  export default {
    name: 'UsersList',
    components: {
      ConfirmModal,
      Modal
    },
    data() {
      return {
        users: [],
        sortKey: '',
        sortOrder: 'asc',
        isModalOpen: false,
        userToRemove: null,
        isErrorModalOpen: false,
        errorMessage: '',
      };
    },
    created() {
      this.fetchUsers();
    },
    computed: {
      sortedUsers() {
        const usersCopy = [...this.users];
        return usersCopy.sort((a, b) => {
          const modifier = this.sortOrder === 'asc' ? 1 : -1;
          const aValue = a[this.sortKey];
          const bValue = b[this.sortKey];
  
          if (typeof aValue === 'string') {
            return aValue.localeCompare(bValue) * modifier;
          }
          return (aValue - bValue) * modifier;
        });
      },
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await api.get('/users');
          this.users = response.data._embedded.userDtoList;
        } catch (error) {
          console.error(error);
        }
      },
      sort(key) {
        if (this.sortKey === key) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortKey = key;
          this.sortOrder = 'asc';
        }
      },
      confirmRemoveUser(userId) {
        this.userToRemove = userId;
        this.isModalOpen = true;
      },
      async removeUser() {
        try {
          await api.delete(`/users/${this.userToRemove}`);
          this.users = this.users.filter(user => user.id !== this.userToRemove);
          this.isModalOpen = false;
        } catch (error) {
          this.isErrorModalOpen = true;
          this.errorMessage = error.response?.data?.message || 'Erro ao remover usuário.';
          this.isModalOpen = false;
        }
      },
      logout() {
        localStorage.clear();
        this.$router.push('/login');
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
    text-align: center;
    border: 1px solid #d5dbe3;
  }
  
  th:hover {
    background-color: #e0e0e0;
  }

  td {
    border: 1px solid #e2e8f0;
  }
  </style>
  