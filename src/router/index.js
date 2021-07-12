import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BooksView from '../views/BooksView.vue'
import BorrowersView from '../views/BorrowersView.vue'
import CheckinView from '../views/CheckinView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import FunctionsView from '../views/FunctionsView.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView
  },
  {
    path: '/books',
    name: 'Books',
    component: BooksView
  },
  {
    path: '/borrowers',
    name: 'Borrowers',
    component: BorrowersView
  },
  {
    path: '/checkin',
    name: 'Check-In',
    component: CheckinView
  },
  {
    path: '/checkout',
    name: 'Check-Out',
    component: CheckoutView
  },
  
  {
    path: '/functions',
    name: 'Functions',
    component: FunctionsView
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
