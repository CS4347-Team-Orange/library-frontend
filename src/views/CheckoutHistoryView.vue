<template>
  <div class="CheckoutHistoryView">
    <h3>Checkout History</h3>
      <div v-show="hasError">
        <b-alert variant="danger" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div name="filters" v-show="needToSearch">
        <form v-on:submit.prevent="runSearch">
            <div class="form-group">
                <label for="search">Search</label>
                <input type="text" class="form-control" id="search" placeholder="Card Number, ISBN, or Borrower Name" v-model="form.search">
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Submit</button>
            </div>
        </form>
      </div>
      <div v-show="!needToSearch & !loaded">
        Loading...
      </div>
      <div v-show="!needToSearch & loaded">
        <center>
          <table border="1">
            <tr>
              <th>Borrower Name</th>
              <th>Book Name</th>
              <th>Check-Out Date</th>
              <th>Check-In Date</th>
              <th>Check-In Button</th>
            </tr>

            <tr v-for="result in results" v-bind:key="result">
                <td>{{result.borrower.name}}</td>
                <td>{{result.book.name}}</td>
                <td>{{result.checkout_date}}</td>
                <td>{{result.checkin_date}}</td>
                <td><button v-show="result.checkin_date == null" v-on:click="this.checkin(result.borrower.cardNumber, result.book.isbn)">Check-In</button></td>
            </tr>
          </table>
        </center>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CheckoutHistoryView',
  data () {
    return {
      results: [],
      form: { 
        search: ''
      },
      loaded: false,
      needToSearch: true,
      hasError: false,
      errorMessage: ''
    }
  },
  methods: {
    getResults: function () {
      this.needToSearch = true
      this.loaded = false
      axios.get('http://localhost:8080/api/checkout/')
        .then(response => {
            this.hasError = false
            console.log(response)
            this.borrowers = response.data.data
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errorMessage = "Failed to get checkouts"
            this.hasError = true
        })
      this.needToSearch = false
      this.loaded = true
    },
    checkin: function(cardNumber, isbn) { 
      var postObj = {
        isbn: isbn,
        cardNumber: cardNumber
      }
      axios.post('http://localhost:8080/api/checkin/', postObj)
        .then(response => {
            this.hasError = false
            console.log(response)
            this.getResults()
        })
        .catch(e => { 
            this.errorMessage = "Failed to checkin"
            this.hasError = true
            alert()
            console.log(e)
        })
    },
  },
  created() { 
      document.title = "Library | Checkout History"
      this.getResults()
  }
}
</script>