<template>
  <div class="Checkin">
    <h1>Book Check-In</h1>
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
    <form v-on:submit.prevent="checkin">
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
    checkin: function() { 
      axios.get('http://localhost:8080/api/loan/checkIn/book/' + this.form.bookId)
        .then(() => {
          this.successMessage = "Checked in success! (" + this.form.bookId + ")"
          this.form.bookId = '';
          this.hasSuccess = true
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
      document.title = "Library | Checkin"
  }
}
</script>

