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
        <button v-on:click="this.getBorrowers()">Reset</button> <button v-on:click="this.new()">New Borrower</button>
        <br />
        <br />
        <table align="center" border="1">
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
            <th>Card ID</th>
            <th></th>
            <th></th>
          </tr>

          <tr v-for="borrower in filteredBorrowers" v-bind:key="borrower">
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
  computed: {
    filteredBorrowers: function() { 
      return this.borrowers.filter(bo => {
          return bo.firstName.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.lastName.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.address.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.city.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.state.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.ssn.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.ssn.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || // TODO strip symbols from search
          bo.phone.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
          bo.phone.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || // TOOD strip symbols from search
          bo.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || 
          bo.cardNumber.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
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
    getBorrowers: function () {
      this.loaded = false
      axios.get('http://127.0.0.1:8080/api/borrower/')
        .then(response => {
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