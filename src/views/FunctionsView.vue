<template>
  <div class="FunctionsView">
    <h3>Functions</h3>
      <center>
          <form v-on:submit.prevent="runFines">
              <div class="form-group">
                  <button class="btn btn-primary">Assess Fines</button>
              </div>
          </form>
      </center>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FunctionsView',
  methods: {
    runFines: function () { 
      axios.get('http://127.0.0.1:8080/api/fines')
      .then(response => {
            console.log(response)
            var respCode = response.data.code
            if (respCode != 0) { 
              throw new Error("API Returned error assessing fines - Check the logs!");
            }
            this.loaded = true
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