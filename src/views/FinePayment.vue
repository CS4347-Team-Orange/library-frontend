<template>
  <div class="PayFine">
    <h1>Paying Fine</h1>
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
    <form v-on:submit.prevent="payFine">
      <div>Paying Fine: ${{ fine.fine_amt }} </div>
      <div>{{ fine.loan.book.title }} for {{ fine.loan.borrower.firstName }} {{ fine.loan.borrower.lastName }} ({{ fine.loan.borrower.cardNumber }})</div>
      <div class="form-group">
          <input type="text" class="form-control" id="amountPaid" placeholder="Amount Paid" v-model="form.amountPaid">
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
  name: 'PayFine',
  data () {
    return {
      errors: [],
      hasError: false,
      errorMessage: '',
      hasSuccess: false,
      successMessage: '',
      form: {
          amountPaid: ''
      },
      fineId: '',
      fine: {
        fine_amt: 0.00,
        loan: { 
            borrower: { 
                firstName: 'Loading',
                lastName: '...',
                cardNumber: 'Loading...'
            }, 
            book: { 
                title: 'Loading'
            }
        }
      }
    }
  },
  methods: {
    getFine: function() { 
      axios.get('http://127.0.0.1:8080/api/fine/loan/' + this.fineId)
        .then((response) => {
            if (response.data.code != 0) { 
                throw response.data.data.message
            }
          console.log(response)
          this.fine = response.data.data
          console.log(this.fine)
        })
        .catch(e => { 
          console.log(e)
          this.errorMessage = "Failed to get fine! " + e.response.data.message 
          this.errors.push(e)
          this.hasError = true
        })
    },
    payFine: function() { 
        axios.get('http://127.0.0.1:8080/api/fine/pay/' + this.fineId + '/' + this.form.amountPaid)
            .then((response) => {
                console.log(response)
                if (response.data.code != 0) { 
                    console.log("ERROR!")
                    console.log(response)
                    this.errorMessage = "Failed to pay fine! " + response.data.message 
                    this.hasError = true
                    this.errors.push(this.errorMessage)
                } else { 
                    console.log(response)
                    this.successMessage = "Paid fine success! (" + this.fineId + ")"
                    this.hasSuccess = true
                }   
            })
            .catch(e => { 

                console.log(e)
                if (e.response.status == 404) { 
                    this.errorMessage = "Fine amount is required!"
                } else { 
                    this.errorMessage = "Failed to get fine! " + e.response.data.message 
                }
                this.errors.push(e)
                this.hasError = true
            })
    }
  },
  created() { 
      document.title = "Library | Fine Payment"
      this.fineId = this.$route.params.id
      this.getFine()
  }
}
</script>

