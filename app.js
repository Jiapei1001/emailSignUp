const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const { response } = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// this step is mainly used to link the html pages
// with the style.css and images
// href link is linked to '/public/'
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    // in order to have this step, must to the signup.html file
    // under the form
    // assign the action = '/' and method="POST"
    // console.log(firstName)

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                },
            },
        ],
    }

    const jsonData = JSON.stringify(data)

    // api url from mailchimp
    // + audience API from account
    const url = 'https://us7.api.mailchimp.com/3.0/lists/b1d6470df7'

    const key = process.env.API_KEY

    console.log(process.env.API_KEY)

    const options = {
        method: 'POST',
        auth: process.env.API_KEY,
    }

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

// if sign up failed, redirec to the /failure route
app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000')
})

// api key
// cd155ab797a1a7da07e41cccc6430f2a - us7

// audience API
// b1d6470df7
