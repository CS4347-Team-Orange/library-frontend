<template>
  <div class="BorrowersEdit">
    <h3>Borrower Management</h3>
      <div v-show="!loaded">
        Loading...
      </div>
      <div class="dropdown">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Check Bootstrap
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
      <div v-show="loaded">
            <form v-on:submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">First Name</label>
                    <input type="text" class="form-control" id="firstName" placeholder="Borrower First Name" v-model="form.firstName">
                </div>
                <div class="form-group">
                    <label for="name">Last Name</label>
                    <input type="text" class="form-control" id="lastName" placeholder="Borrower Last Name" v-model="form.lastName">
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
                    <label for="email">Email</label>
                    <input type="text" class="form-control" id="email" placeholder="Borrower Email" v-model="form.email">
                </div>
                <div class="form-group">
                    <label for="address">Street Address</label>
                    <input type="text" class="form-control" id="address" placeholder="Borrower Street Address" v-model="form.address">
                </div>
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" class="form-control" id="city" placeholder="Borrower City" v-model="form.city">
                </div>
                <div class="form-group">
                    <label for="state">State</label>
                    <input type="text" class="form-control" id="state" placeholder="Borrower State" v-model="form.state">
                </div>
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" placeholder="Borrower Card Number" v-model="form.cardNumber" disabled>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary">Submit</button>
                </div>
            </form>
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
          firstName: '',
          lastName: '',
          city: '',
          state: '',
          email: '',
          ssn: '',
          phone: '',
          address: '',
          cardNumber: ''
    }
    }
  },
  methods: {
    getBorrower: function () {
      axios.get('http://localhost:8080/api/borrower/' + this.borrowerId)
        .then(response => {
            console.log(response)
            var borrower = response.data.data
            this.form.firstName = borrower.firstName
            this.form.lastName = borrower.lastName
            this.form.ssn = borrower.ssn
            this.form.phone = borrower.phone
            this.form.address = borrower.address
            this.form.cardNumber = borrower.cardNumber
            this.form.city = borrower.city
            this.form.state = borrower.state
            this.form.email = borrower.email
            this.loaded = true
        })
        .catch(e => { 
            alert("Failed to retrieve borrower - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    create: function() { 
        axios.post('http://localhost:8080/api/borrower/', this.form)
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
        axios.patch('http://localhost:8080/api/borrower/', this.form)
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