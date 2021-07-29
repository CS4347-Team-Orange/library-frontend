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
            <th></th>
        </tr>
        <tr v-for="loan in singleBorrowerLoans" v-bind:key="loan">
            <td>{{ loan.book.title }}</td>
            <td>{{ loan.date_out }}</td>
            <td>{{ loan.date_in }}</td>
            <td v-if="loan.date_in === 'CHECKED OUT'"><button v-on:click="this.checkin(loan.book)">Check in</button></td>
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
            <th></th>
        </tr>
        <tr v-for="fine in singleBorrowerFines" v-bind:key="fine">
            <td>{{ fine.loan.book.title }}</td>
            <td>{{ fine.paid }}</td>
            <td>${{ fine.fine_amt }}</td>
            <td v-if="!fine.paid"><button v-on:click="this.payFine(fine.loan_id)">Pay</button></td>
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
        checkin: function(book) { 
            axios.get('http://127.0.0.1:8080/api/loan/checkIn/book/' + book.bookId)
            .then((response) => {
                
                if (response.data.code != 0) { 
                    throw response.data.data.message
                }
                this.successMessage = "Checked in " + book.title
                this.hasSuccess = true
                this.getLoans()
            })
            .catch(e => { 
                console.log(e)
                this.errorMessage = "Failed to check in! " + e.response.data.message 
                this.errors.push(e)
                this.hasError = true
            })
        },
        getData: function() { 
            axios.get('http://127.0.0.1:8080/api/borrower/' + this.borrowerId)
                .then(response => {
                    console.log(response)
                    
                    if (response.data.code != 0) { 
                        throw response.data.data.message
                    }
                    this.singleBorrower = response.data.data
                    this.getLoans()
                    this.getFines()
                })
                .catch(e => { 
                    this.errorMessage = "Failed to retrieve borrower. " + e.response.data.message
                    this.hasError = true
                    console.log(e)
                    this.errors.push(e)
                })
        },
        getLoans: function() { 
            axios.get('http://127.0.0.1:8080/api/loan/card/' + this.singleBorrower.cardNumber)
                .then(response => {
                    this.hasError = false
                    console.log(response)

                    if (response.data.code != 0) { 
                        throw response.data.data.message
                    }
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
                    this.errorMessage = "Failed to get loans " + e.response.data.message
                })
        },
        getFines: function() { 
            axios.get('http://127.0.0.1:8080/api/fine/borrower/' + this.singleBorrower.cardNumber)
                .then(response => {
                    if (response.data.code != 0) { 
                        throw response.data.data.message
                    }
                    this.hasError = false
                    console.log(response)
                    this.singleBorrowerFines = response.data.data
                    // for(const l in this.singleBorrowerFines) { 
                    //     this.singleBorrowerFines[l].date_out = this.truncate_time(this.singleBorrowerLoans[l].date_out)
                    // }
                    // for(const l in this.singleBorrowerLoans) { 
                    //     this.singleBorrowerLoans[l].date_in = this.truncate_time(this.singleBorrowerLoans[l].date_in)
                    // }

                })
                .catch(e => { 
                    console.log(e)
                    this.errors.push(e)
                    this.hasError = true
                    this.errorMessage = "Failed to get borrowers " + e.response.data.message
                })
        },
        payFine: function(fineId) {
            this.$router.push('/fines/pay/' + fineId)
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
