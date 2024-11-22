<template>
  <div class="flex">
    <aside :class="{'block': sidebarOpen, 'hidden': !sidebarOpen}" class="md:hidden bg-secondary text-white w-64 h-full p-10 fixed top-0 right-0 z-50 transition-transform duration-300">
      <h1 class="text-xl font-bold mb-6">BibliAF</h1>
      <nav>
        <ul class="flex flex-col space-y-2">
          <li v-if="!isAdmin">
            <router-link to="/books" class="hover:underline">Livros</router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link to="/authors" class="hover:underline">Autores</router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link to="/genres" class="hover:underline">Gêneros</router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link to="/loans" class="hover:underline">Empréstimos</router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link to="/reservations" class="hover:underline">Reservas</router-link>
          </li>
          <li v-if="!isAdmin">
            <router-link to="/users" class="hover:underline">Conta</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/books" class="hover:underline">Livros</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/authors" class="hover:underline">Autores</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/genres" class="hover:underline">Gêneros</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/loans" class="hover:underline">Empréstimos</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/reservations" class="hover:underline">Reservas</router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/admin/users" class="hover:underline">Usuários</router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1">
      <header class="hidden md:flex bg-secondary text-white p-4 justify-between items-center">
        <div class="flex items-center"
          @click="this.$router.push(`/`);">
          <img src="../assets/logo.png" alt="Logo" class="w-8 h-8 mr-2" />
          <h1 class="text-xl font-bold">BibliAF</h1>
        </div>
        <nav>
          <ul class="flex space-x-4">
            <li v-if="!isAdmin">
              <router-link to="/books" class="hover:underline">Livros</router-link>
            </li>
            <li v-if="!isAdmin">
              <router-link to="/authors" class="hover:underline">Autores</router-link>
            </li>
            <li v-if="!isAdmin">
              <router-link to="/genres" class="hover:underline">Gêneros</router-link>
            </li>
            <li v-if="!isAdmin">
              <router-link to="/loans" class="hover:underline">Empréstimos</router-link>
            </li>
            <li v-if="!isAdmin">
              <router-link to="/reservations" class="hover:underline">Reservas</router-link>
            </li>
            <li v-if="!isAdmin">
              <router-link to="/users" class="hover:underline flex items-center space-x-2">
                <div class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/>
                </svg>
              </div>
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/books" class="hover:underline">Livros</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/authors" class="hover:underline">Autores</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/genres" class="hover:underline">Gêneros</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/loans" class="hover:underline">Empréstimos</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/reservations" class="hover:underline">Reservas</router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin/users" class="hover:underline">Usuários</router-link>
            </li>
          </ul>
        </nav>
      </header>

      <header class="md:hidden bg-secondary text-white p-4 flex justify-between items-center">
        <div class="flex items-center">
          <img src="../assets/logo.png" alt="Logo" class="w-8 h-8 mr-2" />
          <h1 class="text-xl font-bold">BibliAF</h1>
        </div>
        <button @click="toggleSidebar" class="focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>
    </div>

    <div v-if="sidebarOpen" @click="toggleSidebar" class="fixed inset-0 bg-black opacity-50 z-40"></div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      sidebarOpen: false,
      isAdmin: false,
    };
  },
  created() {
    this.isAdmin = localStorage.getItem('userRole') === 'ROLE_ADMIN';
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: 'Impact';
}
li {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}
</style>
