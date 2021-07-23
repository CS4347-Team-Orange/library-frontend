<template>
  <div class="Search">
    <h3>Library Catalog</h3>
  </div>
      <div v-show="hasError">
        <b-alert variant="danger" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div v-show="hasSuccess">
        <b-alert variant="" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
          <input type="text" v-model="search" placeholder="Search">
          <button v-on:click="this.getBorrowers()">Reset</button> <button v-on:click="this.new()">Add Book</button>
          <br />
          <br />
          <table align="center" border="1">
            <tr>
              <th>Title</th>
              <th>Author(s)</th>
              <th>Pages</th>
              <th>Publisher</th>
              <th>ISBN-10</th>
              <th>ISBN-13</th>
              <th>Checkout Btn</th>
              <th>Edit Btn</th>
            </tr>

            <tr v-for="book in filteredBooks" v-bind:key="book">
                <td>{{book.title}}</td>
                <td>{{book.authors}}</td>
                <td>{{book.pages}}</td>
                <td>{{book.publisher}}</td>
                <td>{{book.isbn10}}</td>
                <td>{{book.isbn13}}</td>
                <td><button v-on:click="this.toggleState(book)">{{book.stateChangeWord}}</button></td>
                <td><button v-on:click="this.edit(book)">Edit</button></td>
                <td><button v-on:click="this.delete(book)">Delete</button></td>
                
            </tr>
          </table>
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
      successMessage: ''
    }
  },
  computed: {
    filteredBooks: function() { 
      return this.books.filter(b => {
          return b.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
  methods: {
    getBooks: function () {
      this.loaded = false
      axios.get('http://localhost:8080/api/book/')
        .then(response => {
          this.hasError = false
          console.log(response)
          this.books = response.data.data
          for (var b in this.books) { 
            var bo = this.books[b]
            bo.isCheckedOut = false // TODO check if it's checked out...
            if (bo.isCheckedOut) { 
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
            this.errorMessage = "Failed to get book list, API returned unknown exception."
        })
    },
    toggleState: function (book) { 
      if (book.isCheckedOut) { 
        this.checkIn(book)
      } else {
        this.checkOut(book)
      }
    },
    checkIn: function(book) { 
      axios.get('http://localhost:8080/api/checkin/' + book.id)
        .then(function () {
          this.successMessage = "Checked in " + book.title
        })
        .catch(e => { 
          this.errorMessage = "Failed to check in " + book.title + "."
          console.log(e)
          this.errors.push(e)
          this.hasError = true
        })
    },
    checkOut: function(book) { 
      axios.get('http://localhost:8080/api/checkout/' + book.id)
        .then(function () {
          this.successMessage = "Checked out " + book.title
        })
        .catch(e => { 
          this.errorMessage = "Failed to check out " + book.title + "."
          console.log(e)
          this.errors.push(e)
          this.hasError = true
        })
    },
    delete: function(book) { 
      axios.delete('http://localhost:8080/api/book/' + book.id)
        .then(response => {
            this.hasError = false
            console.log(response)
            this.getBooks()
        })
        .catch(e => { 
            this.errorMessage = "Failed to delete book."
            console.log(e)
            this.errors.push(e)
            this.hasError = true
        })
    },
    edit: function(book) {
      const url = "/catalog/edit/" + book.id 
      this.$router.push(url)
    },
    new: function() { 
      const url = "/catalog/add"
      this.$router.push(url)
    }
  },
  created() { 
      document.title = "Library | Catalog View"
      this.getBooks()
  }
}


</script>

