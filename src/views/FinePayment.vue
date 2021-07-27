<template>
  <div class="Checkout">
    <h1>Pay Fine</h1>
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
    <div>
        Paying Fine ID...<br />
        Borrower: Name<br />
    </div>
    <form v-on:submit.prevent="payFine">
      <div class="form-group">
          <label for="amountPaid">Amount Paid</label>
          <input type="text" class="form-control" id="amountPaid" placeholder="Book UUID" v-model="form.amountPaid">
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
          amountPaid: ''
      }
    }
  },
  methods: {
    payFine: function() { 
      axios.post('http://127.0.0.1:8080/api/fine/payment/', this.form)
        .then(() => {
          this.successMessage = "Fine payment success!"
          this.form.bookId = '';
          this.form.cardNumber = '';
          this.hasSuccess = true
        })
        .catch(e => { 
          console.log(e)
          this.errorMessage = "Failed to pay fine! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    }
  },
  created() { 
      document.title = "Library | Fine Payment"
  }
}
</script>

