import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BooksView from '../views/BooksView.vue'
import BorrowersView from '../views/BorrowersView.vue'
import BorrowersEdit from '../views/BorrowersEdit.vue'
import CheckinView from '../views/CheckinView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import FunctionsView from '../views/FunctionsView.vue'
import CatalogView from '../views/CatalogView.vue'
import CatalogEdit from '../views/CatalogEdit.vue'
import BorrowerHistory from '../views/BorrowerHistory.vue'
const routes = [
  {
    path: '/',
    name: 'About',
    component: About
  },
  {
    path: '/authors',
    name: 'Authors',
    component: AuthorsView
  },
  {
    path: '/borrowers',
    name: 'Borrowers',
    component: BorrowersView
  },
  {
    path: '/borrowers/edit/:id',
    name: 'BorrowersEdit',
    component: BorrowersEdit
  },
  {
    path: '/borrowers/create',
    name: 'BorrowersCreate',
    component: BorrowersEdit
  },
  {
    path: '/borrowers/history/:id',
    name: 'BorrowerHistory',
    component: BorrowerHistory
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
    path: '/catalog',
    name: 'Catalog',
    component: CatalogView
  },
  {
    path: '/catalog/edit/:id',
    name: 'CatalogEdit',
    component: CatalogEdit
  },
  {
    path: '/catalog/add',
    name: 'CatalogAdd',
    component: CatalogEdit
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
