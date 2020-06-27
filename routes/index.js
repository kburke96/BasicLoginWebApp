const path = require('path');
const auth = require('http-auth');
const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');

const basic = auth.basic({
	  file: path.join(__dirname, '../users.htpasswd')
});


router.get('/registrations', basic.check((req, res) => {
	Registration.find()
	    .then((registrations) => {
		          res.render('index', { title: 'Listing registrations', pagename: 'Registrations', registrations });
		        })
	    .catch(() => { res.send('Sorry! Something went wrong.'); });
}));


router.get('/deleteReg', (req, res) => {
	res.render('delete', { title: 'Delete registrations', pagename: 'Delete registrations' });
});


router.post('/deleteReg', (req, res) => {
	console.log("The delete button was pressed!");

	Registration.deleteMany( {  }, function (err) {
		if (err) return handleError(err);
	})
	 //.then(() => { res.send('You just deleted all users!'); })
	 .then(() => res.render('form', { title: 'Registration form', pagename: 'Welcome to my app!', message: 'Enter your details' }) )

});

router.get('/', (req, res) => {
	res.render('form',  { title: 'Registration form',
							pagename: 'Welcome to my app!',
							message: 'Enter your details' 
						});
});

router.post('/', (req, res) => {
	[
		    check('name')
		      .isLength({ min: 1 })
		      .withMessage('Please enter a name'),
		    check('email')
		      .isLength({ min: 1 })
		      .withMessage('Please enter an email'),
        ],
	console.log(req.body);
	const errors = validationResult(req);

	    if (errors.isEmpty()) {
		    const registration = new Registration(req.body);
		      registration.save()
		        .then(() => { res.send('Thank you for your registration!'); })
		        .catch((err) => {
				      console.log(err);
				      res.send('Sorry! Something went wrong.');
				    });
		        } else {
				      res.render('form', {
								  title: 'Registration form',
								  pagename: 'Welcome to my app!',
								  message: 'Enter your details',
					              errors: errors.array(),
					              data: req.body,
					            });
				    }
});

module.exports = router;
