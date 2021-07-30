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
    <h4> Attributing Book to {{ author.name }} </h4>
    
    <form v-on:submit.prevent="submit">
        <div class="form-group">
            <input type="text" class="form-control" id="bookId" placeholder="Book UUID, ISBN10, or ISBN13" v-model="bookId">
        </div>
        <div class="form-group">
            <input type="submit" value="Submit">
        </div>
    </form>
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
            bookId: '',
            author: {
                'name': ''
            },
            errors: [],
            hasError: false,
            errorMessage: '',
            hasSuccess: false,
            successMessage: ''
        }
    },
    created() { 
        document.title = "Library | Author Attribution"
        this.authorId = this.$route.params.id
        this.getAuthor()
    },
    methods: {
        getAuthor: function () {
        axios.get('http://127.0.0.1:8080/api/author/' + this.authorId)
            .then(response => {
                if (response.data.code != 0) { 
                    throw response.data.data.message
                }
                console.log(response)
                this.author = response.data.data
                this.loaded = true
            })
            .catch(e => { 
                this.errorMessage = "Failed to retrieve author.  API Returned exception: " + e.response.data.message
                this.hasError = true
                console.log(e)
                this.errors.push(e)
            })
        },
        submit: function() { 
            axios.get('http://127.0.0.1:8080/api/author/link/' + this.authorId + '/' + this.bookId)
                .then(response => {
                    console.log(response)
                    if (response.data.code != 0) { 
                        this.errorMessage = "Failed to attribute book to author. " + response.data.message
                        this.hasError = true
                    } else { 
                        this.$router.push('/author/books/' + this.authorId)
                    }

                })
                .catch(e => { 
                    this.errorMessage = "Failed to attribute book to author. " + e.response.data.message
                    this.hasError = true
                    console.log(e)
                    this.errors.push(e)
                })
        }
    }
}
</script>
