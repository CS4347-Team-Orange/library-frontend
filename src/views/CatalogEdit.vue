<template>
  <div class="CatalogEdit">
    <h3>Book Management</h3>
      <div v-show="hasError">
        <b-alert variant="danger" show dismissible>
          <strong>Error!</strong> {{ errorMessage }}
        </b-alert>
      </div>
      <div v-show="!loaded">
        Loading...
      </div>
      <div v-show="loaded">
             <form v-on:submit.prevent="submitForm">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" class="form-control" id="title" placeholder="Book Title" v-model="form.title">
                </div>
                <div class="form-group">
                    <label for="pages">Author(s)</label>
                    <input type="text" class="form-control" id="author" placeholder="Book Author(s)" v-model="form.author">
                </div>
                <div class="form-group">
                    <label for="pages">Pages</label>
                    <input type="text" class="form-control" id="pages" placeholder="Number of Pages" v-model="form.pages">
                </div>
                <div class="form-group">
                    <label for="cover">Cover Image</label>
                    <input type="text" class="form-control" id="cover" placeholder="URL of Cover Image" v-model="form.cover">
                </div>
                <div class="form-group">
                    <label for="publisher">Publisher</label>
                    <input type="text" class="form-control" id="publisher" placeholder="Book Publisher" v-model="form.publisher">
                </div>
                <div class="form-group">
                    <label for="isbn10">ISBN 10</label>
                    <input type="text" class="form-control" id="isbn10" placeholder="ISBN 10" v-model="form.isbn10">
                </div>
                <div class="form-group">
                    <label for="isbn13">ISBN 13</label>
                    <input type="text" class="form-control" id="isbn13" placeholder="ISBN 13" v-model="form.isbn13">
                </div>
                <div class="form-group">
                    <label for="id">Book ID</label>
                    <input type="text" class="form-control" id="id" placeholder="Book ID" v-model="form.bookId" disabled>
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
  name: 'CatalogEdit',
  data () {
    return {
      isUpdate: false,
      loaded: false,
      bookId: null,
      errors: [],
      hasError: false,
      errorMessage: '',
      form: {
          title: '',
          publisher: '',
          pages: '',
          cover: '',
          isbn10: '',
          isbn13: '',
          id: '',
          author: ''
    }
    }
  },
  methods: {
    getBook: function () {
      axios.get('http://127.0.0.1:8080/api/book/' + this.bookId)
        .then(response => {
            console.log(response)
            var book = response.data.data
            this.form.title = book.title
            this.form.publisher = book.publisher
            this.form.pages = book.pages
            this.form.cover = book.cover
            this.form.isbn10 = book.isbn10
            this.form.isbn13 = book.isbn13
            this.form.bookId = book.bookId
            this.form.author = book.author
            this.loaded = true
        })
        .catch(e => { 
            this.errorMessage = "Failed to retrieve book - API returned unknown error"
            this.hasError = true
            console.log(e)
            this.errors.push(e)
        })
    },
    create: function() { 
        axios.post('http://127.0.0.1:8080/api/book/', this.form)
        .then(response => {
            this.hasError = false;
            console.log(response)
            this.$router.push('/catalog')
        })
        .catch(e => { 
            this.errorMessage = "Failed to create book - API returned unknown error"
            this.hasError = true
            console.log(e)
            this.errors.push(e)
        })
    },
    update: function() { 
        axios.patch('http://127.0.0.1:8080/api/book/', this.form)
        .then(response => {
            console.log(response)
            this.$router.push('/catalog')
        })
        .catch(e => { 
            this.errorMessage = "Failed to update book - API returned unknown error"
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
      document.title = "Library | Book Management"
      if (this.$route.params.id) { 
          this.bookId = this.$route.params.id
          this.isUpdate = true
          this.getBook()
      } else { 
          this.loaded = true
      }
  }
}
</script>