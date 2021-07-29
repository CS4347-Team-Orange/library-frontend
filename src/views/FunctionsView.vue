<template>
  <div class="FunctionsView">
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
    <h3>Functions</h3>
      <center>
          <form v-on:submit.prevent="runFines">
              <div class="form-group">
                  <button class="btn btn-primary">Assess Fines</button>
              </div>
          </form>
          <br />
          <br />
          <form v-on:submit.prevent="runSeed">
              <div class="form-group">
                  <button class="btn btn-primary">Seed Loans</button>
              </div>
          </form>
      </center>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FunctionsView',
  data () {
    return { 
      hasError: false,
      errorMessage: '',
      hasSuccess: false,
      successMessage: ''
    }
  },
  methods: {
    runSeed: function() { 
      axios.get('http://127.0.0.1:8080/api/loan/seed')
      .then(response => {
            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            console.log(response)
            var respCode = response.data.code
            if (respCode != 0) { 
              throw new Error("API Returned error seeding loans - Check the logs!");
            }
            this.loaded = true
            this.hasSuccess = true
            this.successMessage = "Seeded loans data!"
        })
        .catch(e => { 
            alert("Failed to run seed function - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    },
    runFines: function () { 
      axios.get('http://127.0.0.1:8080/api/fine/assess')
      .then(response => {
            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            console.log(response)
            var respCode = response.data.code
            if (respCode != 0) { 
              throw new Error("API Returned error assessing fines - Check the logs!");
            }
            this.loaded = true
            this.hasSuccess = true
            this.successMessage = "Fines have been assessed based on checkout dates!"
        })
        .catch(e => { 
            alert("Failed to run fines function - Check Browser Console & API Logs")
            console.log(e)
            this.errors.push(e)
        })
    }
  },
  created() { 
      document.title = "Library | Fines Management"
  }
}
</script>