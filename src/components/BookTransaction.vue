<template>
  <div class="BookTransaction">
        <form v-on:submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">ISBN</label>
                <input type="text" class="form-control" id="isbn" placeholder="Book ISBN" v-model="form.isbn">
            </div>
            <div class="form-group">
                <label for="ssn">Card #</label>
                <input type="text" class="form-control" id="ssn" placeholder="Borrower Card #" v-model="form.cardNumber">
            </div>
            <div class="form-group">
                <button class="btn btn-primary">Submit</button>
            </div>
        </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BookTransaction',
  props: { 
      action: String
  },
  data () {
    return {
      form: {
          isbn: '',
          cardNumber: ''
      }
    }
  },
  methods: {
    checkout: function() { 
        axios.post('http://127.0.0.1:8080/api/checkout/', this.form)
        .then(response => {
            console.log(response)
            var respCode = response.data.code
            if (respCode != 0) { 
              throw new Error("API failed trying to checkout!")
            }
            this.$router.push('/')
        })
        .catch(e => { 
            alert("Failed to checkout - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    checkin: function() { 
        axios.post('http://127.0.0.1:8080/api/checkin/', this.form)
        .then(response => {
            console.log(response)
            var respCode = response.data.code
            if (respCode != 0) { 
              throw new Error("API failed trying to checkin!")
            }
            this.$router.push('/')
        })
        .catch(e => { 
            alert("Failed to checkin - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    submitForm: function() { 
        if (this.action == "in") { 
            this.checkin()
        } else if (this.action == "out") { 
            this.checkout()
        }
    }
}
}
</script>