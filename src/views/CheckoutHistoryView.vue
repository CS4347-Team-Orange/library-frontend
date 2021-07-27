<template>
  <div class="CheckoutHistoryView">
    <h3>Checkout History</h3>
      <div v-show="hasError">
        <b-alert variant="danger" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div v-show="hasSuccess && !hasError">
        <b-alert variant="success" :max="5" show fade>
          <strong>Success!</strong> {{ successMessage }}
        </b-alert>
      </div>
      <div name="filters">
        <form v-on:submit.prevent="runSearch">
            <div class="form-group">
                <input type="text" class="form-control" id="search" placeholder="Card Number, ISBN, or Borrower Name" v-model="form.search">
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Search</button>
            </div>
        </form>
      </div>
      <div v-show="loaded">
        <center>
          <table border="1">
            <tr>
              <th>Borrower</th>
              <th>Book</th>
              <th>Check-Out</th>
              <th>Due</th>
              <th>Check-In</th>
              <th></th>
            </tr>

            <tr v-for="result in results" v-bind:key="result">
                <td>{{result.borrower.firstName}} {{result.borrower.lastName}} </td>
                <td>{{result.book.title}}</td>
                <td>{{result.date_out}}</td>
                <td>{{result.due_date}}</td>
                <td>{{result.date_in}}</td>
                <td><button v-show="result.date_in === null || result.date_in === 'CHECKED OUT'" v-on:click="this.checkin(result.book_id)">Check-In</button></td>
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
      errorMessage: '',
      hasSuccess: false,
      successMessage: ''
    }
  },
  methods: {
    runSearch: function() { 
      this.getResults()
    },
    truncate_time: function(ts) { 
            if (ts != null) { 
                return ts.split('T')[0]
            }
            else { 
                return 'CHECKED OUT'
            }
    },
    getResults: function () {
      this.needToSearch = true
      this.loaded = false
      axios.get('http://127.0.0.1:8080/api/loan/?query=' + this.form.search)
        .then(response => {
            this.hasError = false
            console.log(response)
            this.results = response.data.data
            for(const r in this.results) { 
              this.results[r].date_out = this.truncate_time(this.results[r].date_out)
              this.results[r].due_date = this.truncate_time(this.results[r].due_date)
              this.results[r].date_in = this.truncate_time(this.results[r].date_in)
            }
          this.loaded = true
        })
        .catch(e => { 
            console.log(e)
            this.errorMessage = "Failed to get loans"
            this.hasError = true
        })
      this.needToSearch = false
      this.loaded = true
    },
    checkin: function(bookId) { 
      axios.get('http://127.0.0.1:8080/api/loan/checkIn/book/' + bookId)
        .then(() => {
          this.successMessage = "Checked in success! (" + bookId + ")"
          this.hasSuccess = true
          this.getResults()
        })
        .catch(e => { 
          console.log(e)
          this.errorMessage = "Failed to check in! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    }
  },
  created() { 
      document.title = "Library | Checkout History"
  }
}
</script>