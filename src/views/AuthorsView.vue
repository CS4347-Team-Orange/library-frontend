<template>
  <div class="AuthorsView">
    <h3>Authors List</h3>
      <div v-show="hasError">
        <b-alert variant="danger" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
        <input type="text" v-model="search" placeholder="Search">
        <button v-on:click="this.searchAuthors()">Search</button> 
        <button v-on:click="this.getAuthors()">Reset</button> 
        <br />
        <button v-on:click="this.new()">New Borrower</button>
        <br />
        <br />
        <table align="center" border="1">
          <thead>
            <th>Name</th>
            <th></th>
            <th></th>
            <th></th>
          </thead>

          <tr v-for="author in authors" v-bind:key="author">
              <td>{{ author.name }}</td>
              <td><button v-on:click="this.books(author.authorId)">Books</button></td>
              <td><button v-on:click="this.edit(author.authorId)">Edit</button></td>
              <td><button v-on:click="this.httpDelete(author.authorId)">Delete</button></td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'AuthorsView',
  data () {
    return {
      authors: [],
      errors: [],
      hasError: false,
      errorMessage: '',
      loaded: false,
      search: ''
    }
  },
  methods: {
    stopShowingSingle: function() {
      this.showingSingle = false 
      this.singleBorrower = {}
      this.singleBorrowerLoans = []
      this.singleBorrowerFines = []
    },
    searchAuthors: function () { 
        axios.get('http://127.0.0.1:8080/api/author/search/' + this.search)
        .then(response => {
          if (response.data.code != 0) { 
              throw response.data.data.message
          }
          this.hasError = false
          console.log(response)
          this.authors = response.data.data
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get authors"
        })
    },
    getAuthors: function () {
      this.loaded = false
      axios.get('http://127.0.0.1:8080/api/author/')
        .then(response => {
          
          if (response.data.code != 0) { 
              throw response.data.data.message
          }
          this.hasError = false
          console.log(response)
          this.authors = response.data.data
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get authors"
        })
    },
    httpDelete: function(authorId) { 
      axios.delete('http://127.0.0.1:8080/api/author/' + authorId)
        .then(response => {

            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            this.hasError = false
            console.log(response)
            this.getAuthors()
        })
        .catch(e => { 
            alert("Failed to delete author - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to delete author"
        })


    },
    books: function(authorId) { 
      const url = "/author/books/" + authorId
      this.$router.push(url)
    },
    edit: function(authorId) {
      const url = "/author/edit/" + authorId 
      this.$router.push(url)
    },
    new: function() { 
      const url = "/author/create"
      this.$router.push(url)
    }
  },
  created() { 
      document.title = "Library | Authors"
      this.getAuthors()
  }
}
</script>