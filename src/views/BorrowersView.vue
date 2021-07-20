<template>
  <div class="BorrowersView">
    <h3>Borrowers List</h3>
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
          <input type="text" v-model="search" placeholder="Search">
          <button v-on:click="this.getBorrowers()">Clear Search</button> <button v-on:click="this.new()">New Borrower</button>
          <br />
          <br />

          <b-alert show>Test</b-alert>
          <b-table striped hover :items="filteredBorrowers"></b-table>
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
          bo.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1
      })
    }
  },
  methods: {
    
    getBorrowers: function () {
      this.loaded = false
      axios.get('http://localhost:8080/api/borrower/')
        .then(response => {
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
            alert("Failed to get borrowers - Check Browser Console & API Logs")
        })
    },
    httpDelete: function(cardNumber) { 
      axios.delete('http://localhost:8080/api/borrower/' + cardNumber)
        .then(response => {
            console.log(response)
            this.getBorrowers()
        })
        .catch(e => { 
            alert("Failed to delete borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
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