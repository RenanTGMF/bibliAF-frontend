import { createRouter, createWebHistory } from 'vue-router';
import BooksList from '../components/Books.vue';
import BookDetails from '../components/BookDetails.vue';
import BooksAdmin from '@/components/BooksAdmin.vue';
import BooksForm from '@/components/BooksForm.vue';
import AuthorsList from '../components/Authors.vue';
import AuthorBooks from '@/components/AuthorBooks.vue';
import AuthorsAdmin from '@/components/AuthorsAdmin.vue';
import AuthorsForm from '@/components/AuthorsForm.vue';
import GenresList from '../components/Genres.vue';
import GenreBooks from '@/components/GenreBooks.vue';
import GenresAdmin from '@/components/GenresAdmin.vue';
import GenresForm from '@/components/GenresForm.vue';
import LoginForm from '../components/Login.vue';
import RegisterForm from '../components/Register.vue';
import LoansList from '../components/Loans.vue';
import LoansAdmin from '@/components/LoansAdmin.vue';
import LoansForm from '@/components/LoansForm.vue';
import ReservationsList from '../components/Reservations.vue';
import ReservationsAdmin from '@/components/ReservationsAdmin.vue';
import ReservationsForm from '@/components/ReservationsForm.vue';
import UsersAdmin from '@/components/UsersAdmin.vue';
import UsersForm from '@/components/UsersForm.vue';
import Users from '@/components/Users.vue';

const routes = [
  { path: '/login', component: LoginForm },
  { path: '/register', component: RegisterForm },

  { path: '/books', component: BooksList, meta: { requiresAuth: true } },
  { path: '/authors', component: AuthorsList, meta: { requiresAuth: true } },
  { path: '/genres', component: GenresList, meta: { requiresAuth: true } },
  { path: '/loans', component: LoansList, meta: { requiresAuth: true } },
  { path: '/reservations', component: ReservationsList, meta: { requiresAuth: true } },
  { path: '/users', component: Users, meta: { requiresAuth: true } },
  { path: '/edit/user/:id', component: UsersForm, meta: { requiresAuth: true } },
  
  { path: '/books/:id', component: BookDetails, meta: { requiresAuth: true } },
  { path: '/authors/:id', component: AuthorBooks, meta: { requiresAuth: true } },
  { path: '/genres/:id', component: GenreBooks, meta: { requiresAuth: true } },

  { path: '/admin/books', component: BooksAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/authors', component: AuthorsAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/genres', component: GenresAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/loans', component: LoansAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/reservations', component: ReservationsAdmin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', component: UsersAdmin, meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/admin/edit/books/:id', component: BooksForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/book', component: BooksForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/authors/:id', component: AuthorsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/author', component: AuthorsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/genres/:id', component: GenresForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/genre', component: GenresForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/loans/:id', component: LoansForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/loan', component: LoansForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/reservations/:id', component: ReservationsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/reservation', component: ReservationsForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/edit/users/:id', component: UsersForm, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/add/user', component: UsersForm, meta: { requiresAuth: true, requiresAdmin: true } },
  
  { path: '/', redirect: ({ query: { isAdmin } }) => {
    return isAdmin ? '/books' : '/admin/books';
}},
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

function isTokenExpired() {
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (!expirationTime) return true;
  const now = new Date().getTime();
  return now > expirationTime;
}

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('userRole') === 'ROLE_ADMIN';

  if (to.matched.some(record => record.meta.requiresAuth) && (!isLoggedIn || isTokenExpired())) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    next('/login');
  } 
  else if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    next('/books');
  } else {
    next();
  }
});

export default router;
