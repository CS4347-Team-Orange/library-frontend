<template>
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
    <h4> Books for {{ author.name }} </h4>
    
    <button v-on:click="this.attribute(authorId)"> New Attribution</button>

    <div align="center">
        <table border=1>
        <tr>
            <th>Book</th>
            <th>ISBN10</th>
            <th>ISBN13</th>
            <th></th>
        </tr>
        <tr v-for="book in authorBooks" v-bind:key="book">
            <td>{{ book.title }}</td>
            <td>{{ book.isbn10 }}</td>
            <td>{{ book.isbn13 }}</td>
        </tr>
        </table>
    </div>
    <br />
</template>

<style>
#left {
    float: left;
    width: 50%;
}
#right {
  float: right;
  width: 50%;
}
</style>


<script>
import axios from 'axios';
export default {
    name: 'BorrowerHistory',
    data() { 
        return {
            authorId: '',
            author: {},
            authorBooks: [],
            errors: [],
            hasError: false,
            errorMessage: '',
            hasSuccess: false,
            successMessage: ''
        }
    },
    created() { 
        document.title = "Library | Borrower History"
        this.authorId = this.$route.params.id
        this.getData()
    },
    methods: {
        getData: function() { 
            axios.get('http://127.0.0.1:8080/api/author/' + this.authorId)
                .then(response => {
                    console.log(response)
                    if (response.data.code != 0) { 
                        throw response.data.data.message
                    }

                    this.author = response.data.data
                    this.getBooks()
                })
                .catch(e => { 
                    this.errorMessage = "Failed to retrieve books for author. " + e.response.data.message
                    this.hasError = true
                    console.log(e)
                    this.errors.push(e)
                })
        },
        getBooks: function() { 
            axios.get('http://127.0.0.1:8080/api/book/author/' + this.authorId)
                .then(response => {
                    console.log(response)
                    if (response.data.code != 0) { 
                        throw response.data.data.message
                    }

                    this.authorBooks = response.data.data
                })
                .catch(e => { 
                    this.errorMessage = "Failed to retrieve books for author. " + e.response.data.message
                    this.hasError = true
                    console.log(e)
                    this.errors.push(e)
                })
        },
        attribute: function() { 
            this.$router.push('/author/attribute/' + this.authorId)
        }
    }
}
</script>
