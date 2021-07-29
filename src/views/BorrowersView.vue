<template>
  <div class="BorrowersView">
    <h3>Borrowers List</h3>
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
        <button v-on:click="this.searchBorrowers()">Search</button> 
        <button v-on:click="this.getBorrowers()">Reset</button> 
        <br />
        <button v-on:click="this.new()">New Borrower</button>
        <br />
        <br />
        <table align="center" border="1">
          <thead>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
            <th>Card ID</th>
            <th></th>
            <th></th>
          </thead>

          <tr v-for="borrower in borrowers" v-bind:key="borrower">
              <td>{{borrower.firstName}} {{borrower.lastName}}</td>
              <td><a :href="'tel:' + borrower.phone">{{borrower.phone}}</a></td>
              <td><a target="_blank" :href="'https://maps.google.com/?q=' + borrower.mapsQueryParam">{{borrower.address}} {{borrower.city}}, {{borrower.state}}</a></td>
              <td><a target="_blank" :href="'mailto:' + borrower.email">{{borrower.email}}</a></td>
              <td>{{borrower.cardNumber}}</td>
              <td><button v-on:click="this.history(borrower.cardNumber)">History</button></td>
              <td><button v-on:click="this.edit(borrower.cardNumber)">Edit</button></td>
              <td><button v-on:click="this.httpDelete(borrower.cardNumber)">Delete</button></td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'BorrowersView',
  data () {
    return {
      borrowers: [],
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
    history: function(borrowerId) {
      const url = "/borrowers/history/" + borrowerId 
      this.$router.push(url)
    },
    searchBorrowers: function () { 
        axios.get('http://127.0.0.1:8080/api/borrower/search/' + this.search)
        .then(response => {
          if (response.data.code != 0) { 
              throw response.data.data.message
          }
          this.hasError = false
          console.log(response)
          this.borrowers = response.data.data
          for (var b in this.borrowers) { 
            var bo = this.borrowers[b]
            var address = bo.address + " " + bo.city + ", " + bo.state
            bo.mapsQueryParam = encodeURIComponent(address)
          }
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get borrowers"
        })
    },
    getBorrowers: function () {
      this.loaded = false
      axios.get('http://127.0.0.1:8080/api/borrower/')
        .then(response => {
          
          if (response.data.code != 0) { 
              throw response.data.data.message
          }
          this.hasError = false
          console.log(response)
          this.borrowers = response.data.data
          for (var b in this.borrowers) { 
            var bo = this.borrowers[b]
            var address = bo.address + " " + bo.city + ", " + bo.state
            bo.mapsQueryParam = encodeURIComponent(address)
          }
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get borrowers"
        })
    },
    httpDelete: function(cardNumber) { 
      axios.delete('http://127.0.0.1:8080/api/borrower/' + cardNumber)
        .then(response => {

            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            this.hasError = false
            console.log(response)
            this.getBorrowers()
        })
        .catch(e => { 
            alert("Failed to delete borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
            this.hasError = true
            this.errorMessage = "Failed to get borrowers"
        })


    },
    edit: function(cardNumber) {
      const url = "/borrowers/edit/" + cardNumber 
      this.$router.push(url)
    },
    new: function() { 
      const url = "/borrowers/create"
      this.$router.push(url)
    }
  },
  created() { 
      document.title = "Library | Borrowers"
      this.getBorrowers()
  }
}
</script>