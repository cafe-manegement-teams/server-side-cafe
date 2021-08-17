const fs = require('fs')
const express = require('express')
const app = express();
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const User = require('../model/user.model')


app.use(express.json()) // for parsing application/json

const ValidateEmail = (mail) =>  {
	var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if(mail.match(mailformat)) {
		return "Valid email address!";
	}
	else {
		return "You have entered an invalid email address!";
		 }
}

module.exports.register = function (req,res) {
	const {name,username, password} = req.body;
	// Check empty fields
	if(!username || !password || !name) {
		res.json({message : "Please fill all fields"})
	} else {
		// Validation Email format
		check_mail = ValidateEmail(username);
		if (check_mail !== "Valid email address!") {
			res.json({message : check_mail})
		} else {
			// Check existense of username entered
			User.getUserByUsername(
				username, 
				async (err, result) => {
				if (err) {
					res.json({ message: "Something went wrong" });
				} else {
					if (result.length !== 0) {
						res.json({ message: "Username is in used" });
					} else {
						// Hash Password
						const hash = await bcrypt.hash(password, 8)
						
						// Initiallize User Object
						const user = new User({
							name :name,
							username :username,
							password: hash
						})
						console.log(user)
						// Save new user
						User.save(user, (err, result) => {
							if (err)
								throw err;
							res.status(200)
								.json({ message: "Successfully" });
						})
					}
				}
			});
		}
	} 
}

module.exports.deleteUser = function(req,res) {
	var userId = req.params.id;
	
	User.getUserById(userId, (err, result)=> {
		if(err) {
			throw err;
		} else {
			if(result.length !== 0) {
				User.delete(userId, (err, result)=> {
					if(err) {
						console.log(err);
					} else {
						res.json({message : 'Delete Successfully'})
						.status('200')
					}
				})			
			} else {
				res
				.status(404)
				.json({message : 'User ID not found'})
			}
		}
	})
}

module.exports.getAllUsers = function(req,res) {
	User.getAllUsers(function(err, users) {
		if(err) {
			console.log(err)
		} else {
			res.send({users : users})
		}
	 });
}

module.exports.getUserById= (req,res) => {
	User.getUserById(req.params.id, (err, user)=> {
		if(err) throw err ;
		res.json({user})
		.status(200)
	})
}