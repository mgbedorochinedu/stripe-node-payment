const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 
require ('dotenv').config()


var Publishable_Key = process.env.PUBLISHABLE_SECRET_KEY
var Secret_Key = process.env.STRIPE_SECRET_KEY

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
	res.render('Home', { 
	key: Publishable_Key 
	}) 
}) 

app.post('/payment', function(req, res){ 

	// Moreover you can take more details from user like Address, Name, etc from form 
	stripe.customers.create({ 
		email: req.body.stripeEmail, 
		source: req.body.stripeToken, 
		name: 'Mgbedoro Chinedu', 
		address: { 
			postal_code: '101283', 
			city: 'Surulere', 
			state: 'Lagos', 
			country: 'Nigeria', 
		} 
	}) 
	.then((customer) => { 

		return stripe.charges.create({ 
			amount: 7000,
			description: 'Web Development Product', 
			currency: 'USD', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.send("Success") // If no error occurs 
	}) 
	.catch((err) => { 
		res.send(err)	 // If some error occurs 
	}); 
}) 

app.listen(port, function(error){ 
	if(error) throw error 
	console.log(`Server has started at ${port}`) 
}) 
