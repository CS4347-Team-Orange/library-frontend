<template>
  <div class="BorrowersEdit">
    <h3>Borrower Management</h3>
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
        <center>
            <form v-on:submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Borrower Name" v-model="form.name">
                </div>
                <div class="form-group">
                    <label for="ssn">SSN</label>
                    <input type="text" class="form-control" id="ssn" placeholder="Borrower SSN" v-model="form.ssn">
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="text" class="form-control" id="phone" placeholder="Borrower Phone" v-model="form.phone">
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" class="form-control" id="address" placeholder="Borrower Address" v-model="form.address">
                </div>
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" placeholder="Borrower Card Number" v-model="form.cardNumber" disabled>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary">Submit</button>
                </div>
            </form>
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
      isUpdate: false,
      loaded: false,
      borrowerId: null,
      errors: [],
      form: {
          name: '',
          ssn: '',
          phone: '',
          address: '',
          cardNumber: ''
    }
    }
  },
  methods: {
    getBorrower: function () {
      axios.get('http://127.0.0.1:8080/api/borrower/' + this.borrowerId)
        .then(response => {
            console.log(response)
            var borrower = response.data.data
            this.form.name = borrower.name
            this.form.ssn = borrower.ssn
            this.form.phone = borrower.phone
            this.form.address = borrower.address
            this.form.cardNumber = borrower.cardNumber
            this.loaded = true
        })
        .catch(e => { 
            alert("Failed to retrieve borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    create: function() { 
        axios.post('http://127.0.0.1:8080/api/borrower/', this.form)
        .then(response => {
            console.log(response)
            this.$router.push('/borrowers')
        })
        .catch(e => { 
            alert("Failed to create borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    update: function() { 
        console.log("Sending patch: ")
        console.log(this.form)
        axios.patch('http://127.0.0.1:8080/api/borrower/', this.form)
        .then(response => {
            console.log(response)
            this.$router.push('/borrowers')
        })
        .catch(e => { 
            alert("Failed to update borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    submitForm: function() { 
        if (this.isUpdate) { 
            this.update()
        } else {
            this.create()
        }
    }
  },
  created() { 
      document.title = "Library | Borrower Management"
      if (this.$route.params.id) { 
          this.borrowerId = this.$route.params.id
          this.isUpdate = true
          this.getBorrower()
      } else { 
          this.loaded = true
      }
  }
}
</script>