<template>
  <div class="AuthorsEdit">
    <h3>Authors Management</h3>
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
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
             <form v-on:submit.prevent="submitForm">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Author Name" v-model="form.name">
                </div>
                <div class="form-group">
                    <input type="submit" value="Submit">
                </div>
            </form>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AuthorsEdit',
  data () {
    return {
      isUpdate: false,
      loaded: false,
      authorId: null,
      errors: [],
      hasError: false,
      errorMessage: '',
      hasSuccess: false,
      successMessage: '',
      form: {
          name: ''
      }
    }
  },
  methods: {
    getAuthor: function () {
      axios.get('http://127.0.0.1:8080/api/author/' + this.authorId)
        .then(response => {
            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            console.log(response)
            var author = response.data.data
            this.form.name = author.name
            this.loaded = true
        })
        .catch(e => { 
            this.errorMessage = "Failed to retrieve author.  API Returned exception: " + e.response.data.message
            this.hasError = true
            console.log(e)
            this.errors.push(e)
        })
    },
    create: function() { 
        axios.post('http://127.0.0.1:8080/api/author/', this.form)
        .then(response => {
            if (response.data.code != 0) { 
                throw response.data.data.message
            }
            this.hasError = false;
            console.log(response)
            this.$router.push('/authors')
        })
        .catch(e => { 
            this.errorMessage = "Failed to create author.  API Returned exception: " + e.response.data.message
            this.hasError = true
            console.log(e)
            this.errors.push(e)
        })
    },
    update: function() { 
        console.log("Sending patch: ")
        console.log(this.form)
        axios.patch('http://127.0.0.1:8080/api/author/', this.form)
        .then(response => {
            console.log(response)
            this.$router.push('/authors')
        })
        .catch(e => { 
            this.errorMessage = "Failed to update author.  API Returned exception: " + e.response.data.message
            this.hasError = true
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
      document.title = "Library | Author Management"
      if (this.$route.params.id) { 
          this.authorId = this.$route.params.id
          this.isUpdate = true
          this.getAuthor()
      } else { 
          this.loaded = true
      }
  }
}
</script>