<template>
  <div class="Search">
    <h3>Library Catalog</h3>
  </div>
      <div v-show="hasError">
        <b-alert variant="danger" :max="5" show fade>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div v-show="hasSuccess && !hasError">
        <b-alert variant="success" :max="5" show fade>
          <strong>Success!</strong> {{ successMessage }}
        </b-alert>
      </div>
      <div v-show="!checkingOut">
        <input type="text" v-model="search" placeholder="Search">
        <button v-on:click="this.getBooks()">Reset</button> <button v-on:click="this.new()">Add Book</button>
        <br />
        <br />
        <div id="pageButtons">
          <button v-on:click="this.decPageNumber()">Previous Page</button>
          <button v-on:click="this.incPageNumber()">Next Page</button>
        </div>
        <br /><br />
        <div v-show="!loaded">
          Loading...
        </div>
        <div v-show="loaded">
            <table align="center" border="1">
              <tr>
                <th>Title</th>
                <th>Author(s)</th>
                <th>Pages</th>
                <th>Publisher</th>
                <th>ISBN-10</th>
                <th>ISBN-13</th>
                <th></th>
                <th></th>
              </tr>

              <tr v-for="book in filteredBooks" v-bind:key="book">
                  <td>{{book.title}}</td>
                  <td>{{book.author}}</td>
                  <td>{{book.pages}}</td>
                  <td>{{book.publisher}}</td>
                  <td>{{book.isbn10}}</td>
                  <td>{{book.isbn13}}</td>
                  <td><button v-on:click="this.toggleState(book)">{{book.stateChangeWord}}</button></td>
                  <td><button v-on:click="this.edit(book)">Edit</button></td>
                  <td><button v-on:click="this.delete(book)">Delete</button></td>
              </tr>

              <div v-show="filteredBooks.length === 0"> 
                No results!
              </div>

            </table>
          </div>
      </div>
      <div v-show="checkingOut">
            Checking out {{ bookToCheckout.title }} <br />
            <div class="form-group">
              <input type="text" class="form-control" v-model="cardNumber" placeholder="Card Number">
            </div>
            <button v-on:click="this.checkOut(bookToCheckout, cardNumber)">Check out</button>
            <br />
            <button v-on:click="this.abortCheckout()">Abort</button>
            
          </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CatalogView',
  data () {
    return {
      books: [],
      errors: [],
      hasError: false,
      errorMessage: '',
      loaded: false,
      search: '',
      hasSuccess: false,
      successMessage: '',
      pageNumber: 1,
      checkingOut: false,
      cardNumber: '',
      bookToCheckout: {
        title: 'Pending'
      },
      checkoutSuccess: false
    }
  },
  computed: {
    filteredBooks: function() { 
      return this.books.filter(b => {
        return (b.title != null && b.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
          (b.author != null && b.author.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
          (b.publisher != null && b.publisher.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
          (b.isbn10 != null && b.isbn10.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
          (b.isbn13 != null && b.isbn13.toLowerCase().indexOf(this.search.toLowerCase()) > -1) ||
          (b.bookId != null && b.bookId.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
      })
    }
  },
  methods: {
    getBooks: function () {
      this.loaded = false
      axios.get('http://127.0.0.1:8080/api/book/?page=' + this.pageNumber)
        .then(response => {
          this.hasError = false
          console.log(response)
          this.books = response.data.data
          for (var b in this.books) { 
            var bo = this.books[b]
            if (bo.checkedOut) { 
              bo.stateChangeWord = "Check In"
            } else {
              bo.stateChangeWord = "Check Out"
            }
          }
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get book list, API Returned error: " + e.response.data.message 
        })
    },
    incPageNumber: function() { 
      this.setPageNumber(this.pageNumber + 1)
    },
    decPageNumber: function() { 
      this.setPageNumber(this.pageNumber - 1)
    },
    setPageNumber: function(pn) { 
      this.pageNumber = pn
      this.getBooks()
    },
    toggleState: function (book) { 
      if (book.checkedOut) { 
        this.checkIn(book)
      } else {
        this.getCardNumber(book)
      }
    },
    checkIn: function(book) { 
      axios.get('http://127.0.0.1:8080/api/loan/checkIn/book/' + book.bookId)
        .then(() => {
          this.successMessage = "Checked in " + book.title
          this.hasSuccess = true
          this.getBooks()
        })
        .catch(e => { 
          console.log(e)
          this.errorMessage = "Failed to check in! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    },
    getCardNumber: function(book) {
      this.bookToCheckout = book; 
      this.checkingOut = true;
    },
    checkOut: function(book, cardId) { 
      this.checkoutSuccess = false
      axios.get('http://127.0.0.1:8080/api/loan/checkOut/' + book.bookId + '/' + cardId)
        .then(() => {
          this.successMessage = "Checked out " + book.title
          this.hasSuccess = true
          this.checkingOut = false
          this.cardNumber = ''
          this.getBooks()
        })
        .catch((e) => { 
          console.log(e)
          this.errorMessage = "Failed to check out! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    },
    delete: function(book) { 
      axios.delete('http://127.0.0.1:8080/api/book/' + book.bookId)
        .then(response => {
            this.hasError = false
            console.log(response)
            this.getBooks()
        })
        .catch(e => { 
            this.errorMessage = "Failed to delete book. " + e.response.data.message
            console.log(e)
            this.errors.push(e)
            this.hasError = true
        })
    },
    edit: function(book) {
      const url = "/catalog/edit/" + book.bookId 
      this.$router.push(url)
    },
    new: function() { 
      const url = "/catalog/add"
      this.$router.push(url)
    },
    abortCheckout: function() { 
      this.bookToCheckout = {
        title: 'Pending'
      }

      this.cardNumber = ''
      this.checkingOut = false

    }
  },
  created() { 
      document.title = "Library | Catalog View"
      this.getBooks()
  }
}


</script>

