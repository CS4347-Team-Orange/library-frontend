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
import FinePayment from '../views/FinePayment.vue'
import CheckoutHistoryView from '../views/CheckoutHistoryView.vue'
import AuthorsEdit from '../views/AuthorsEdit.vue'
import AuthorBooks from '../views/AuthorBooks.vue'
import AuthorAttribute from '../views/AuthorAttribute.vue'

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
  {
    path: '/fines/pay/:id',
    name: 'FinePayment',
    component: FinePayment
  },
  {
    path: '/loan/history',
    name: 'LoanHistory',
    component: CheckoutHistoryView
  },
  {
    path: '/author/edit/:id',
    name: 'AuthorsEdit',
    component: AuthorsEdit
  },
  {
    path: '/author/create/',
    name: 'AuthorsCreate',
    component: AuthorsEdit
  },
  {
    path: '/author/books/:id',
    name: 'AuthorBooks',
    component: AuthorBooks
  },
  {
    path: '/author/attribute/:id',
    name: 'AuthorAttribute',
    component: AuthorAttribute
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
