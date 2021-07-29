<template>
  <div class="Checkout">
    <h1>Book Check-Out</h1>
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
    <form v-on:submit.prevent="checkout">
      <div class="form-group">
          <label for="cardNumber">Card Number</label>
          <input type="text" class="form-control" id="firstName" placeholder="Borrower Card Number" v-model="form.cardNumber">
      </div>
      <div class="form-group">
          <label for="bookId">Book ID</label>
          <input type="text" class="form-control" id="lastName" placeholder="Book UUID" v-model="form.bookId">
      </div>
      <div class="form-group">
          <input type="submit" value="Submit">
      </div>
  </form>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'BorrowersView',
  data () {
    return {
      errors: [],
      hasError: false,
      errorMessage: '',
      hasSuccess: false,
      successMessage: '',
      form: {
          bookId: '',
          cardNumber: ''
      }
    }
  },
  methods: {
    checkout: function() { 
      axios.get('http://127.0.0.1:8080/api/loan/checkOut/' + this.form.bookId + '/' + this.form.cardNumber)
        .then((response) => {
          if (response.data.code != 0) { 
            throw response.data.data.message
          }
          this.successMessage = "Checked out success! (" + this.form.bookId + ")"
          this.form.bookId = '';
          this.form.cardNumber = '';
          this.hasSuccess = true
        })
        .catch(e => { 
          console.log(e)
          this.errorMessage = "Failed to check out! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    }
  },
  created() { 
      document.title = "Library | Checkout"
  }
}
</script>

