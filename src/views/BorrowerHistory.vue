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
    <h4> History for {{ singleBorrower.firstName }} {{ singleBorrower.lastName }} </h4>
    <h5>Loans History</h5>
    
    <div align="center">
        <table border=1>
        <tr>
            <th>Book</th>
            <th>Checked out</th>
            <th>Checked in</th>
        </tr>
        <tr v-for="loan in singleBorrowerLoans" v-bind:key="loan">
            <td>{{ loan.book.title }}</td>
            <td>{{ loan.date_out }}</td>
            <td>{{ loan.date_in }}</td>
        </tr>
        </table>
    </div>
    <h5>Fines History</h5>
    <div align="center">
        <table border="1">
        <tr>
            <th>Book</th>
            <th>Fine paid on</th>
            <th>Fine amount</th>
        </tr>
        <tr v-for="fine in singleBorrowerFines" v-bind:key="fine">
            <td>{{ fine.book.title }}</td>
            <td>{{ fine.paidOn }}</td>
            <td>{{ fine.amount }}</td>
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
            borrowerId: '',
            singleBorrower: {},
            singleBorrowerLoans: [],
            singleBorrowerFines: [],
            errors: [],
            hasError: false,
            errorMessage: '',
            hasSuccess: false,
            successMessage: ''
        }
    },
    created() { 
        document.title = "Library | Borrower History"
        this.borrowerId = this.$route.params.id
        this.getData()
    },
    methods: {
        getData: function() { 
            axios.get('http://localhost:8080/api/borrower/' + this.borrowerId)
                .then(response => {
                    console.log(response)
                    this.singleBorrower = response.data.data
                    this.getLoans()
                })
                .catch(e => { 
                    this.errorMessage = "Failed to retrieve borrower. " + e.response.data.message
                    this.hasError = true
                    console.log(e)
                    this.errors.push(e)
                })
        },
        getLoans: function() { 
            axios.get('http://localhost:8080/api/loan/card/' + this.singleBorrower.cardNumber)
                .then(response => {
                    this.hasError = false
                    console.log(response)
                    this.singleBorrowerLoans = response.data.data
                    for(const l in this.singleBorrowerLoans) { 
                        this.singleBorrowerLoans[l].date_out = this.truncate_time(this.singleBorrowerLoans[l].date_out)
                    }
                    for(const l in this.singleBorrowerLoans) { 
                        this.singleBorrowerLoans[l].date_in = this.truncate_time(this.singleBorrowerLoans[l].date_in)
                    }

                })
                .catch(e => { 
                    console.log(e)
                    this.errors.push(e)
                    this.hasError = true
                    this.errorMessage = "Failed to get borrowers " + e.response.data.message
                })
        },
        truncate_time: function(ts) { 
            if (ts != null) { 
                return ts.split('T')[0]
            }
            else { 
                return 'CHECKED OUT'
            }
        }
    }
}
</script>
