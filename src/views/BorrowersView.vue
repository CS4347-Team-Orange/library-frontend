<template>
  <div class="BorrowersView">
    <h3>Borrowers List</h3>
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
        <center>
          <button v-on:click="this.new()">New Borrower</button>
          <br />
          <br />
          <table border="1">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Card ID</th>
              <th></th>
              <th></th>
            </tr>

            <tr v-for="borrower in borrowers" v-bind:key="borrower">
                <td>{{borrower.name}}</td>
                <td>{{borrower.phone}}</td>
                <td>{{borrower.address}}</td>
                <td>{{borrower.cardNumber}}</td>
                <td><button v-on:click="edit(borrower.cardNumber)">Edit</button></td>
                <td><button v-on:click="this.delete(borrower.cardNumber)">Delete</button></td>
            </tr>
          </table>
        </center>
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
      loaded: false
    }
  },
  methods: {
    getBorrowers: function () {
      this.loaded = false
      axios.get('http://localhost:8080/api/borrower/')
        .then(response => {
            console.log(response)
            this.borrowers = response.data.data
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errors.push(e)
            alert("Failed to get borrowers - Check Browser Console & API Logs")
        })
    },
    delete: function(cardNumber) { 
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