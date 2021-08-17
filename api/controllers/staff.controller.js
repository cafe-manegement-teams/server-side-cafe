const { response } = require('express');
const express = require('express');
const Staff = require('../model/staff.model');
const app = express();

function check_date_input(dateString) {
	try {
		var date = dateString.slice(0 , dateString.indexOf("/"))
		var date2 = dateString.slice(dateString.indexOf("/")+1) 
		var year = date2.slice(date2.indexOf("/")+1)
		var month = date2.slice(0,date2.indexOf("/"))
		var check;
		if(Number(date)>31 || Number(date)<1 || Number(month)>12 || Number(month)<1 
		 || Number(year) > 2021 || year.length < 4 || year == '0000' ) {
			check = false;
		} else { check = true }
		return check;
	} catch(error) {
		console.error(error);
	}
}


module.exports.viewStaff = function(req,res) {
	Staff.getAllStaffs((err,staffList)=> {
		if(err) throw err;

		return res.json({staff : staffList})
	})
};


module.exports.createStaff = function(req,res) {
	const {name, position, shift, date} = req.body;

	if(!name || !date || !position || !shift ) {
		return res.json({message : 'Please fill all fields'})
	}

	const isDateValid = check_date_input(date)
	if(isDateValid === false) {
		return res.json({message : 'Invalid date format'})
	}

	Staff.isExist(name, (result)=> {
		if(result === true) {
			return res.json({message : 'Staff is already in'})
		} else {
			const staff = new Staff({
				name : name,
				position : position,
				shift : shift,
				date : date
			})
		
			Staff.save(staff)
			return res.json({message : 'Successfully'})
		}		
	})
};


module.exports.searchStaff = function(req,res) {
 	var key = req.query.key;
	Staff.getAllStaffs((err,staffList)=> {
		if(err) throw err;

		var matchedStaff = staffList.filter(function(staff){
			return staff.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
		})
		return res.json({staffMatched : matchedStaff})
	})
 }

module.exports.deleteStaff = function(req,res) {
	var staffId = req.params.id;

	Staff.getStaffById(staffId, (err, result)=> {
		if(err) {
			throw err;
		} else {
			if(result.length !== 0) {
				Staff.delete(staffId, (err, result)=> {
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
				.json({message : 'Staff ID not found'})
			}
		}
	})
}

module.exports.getInforStaff = function(req,res) {
	const staffId = req.params.id;
	Staff.getStaffById(staffId ,(err,staff)=> {
		if(err) throw err;
		return res.json({staffInformation : staff})
	})
}

module.exports.updateStaff = function(req,res) {
	const staffId= req.params.id;

	const {name, position, shift, date} = req.body;

	if(!name || !date || !position || !shift ) {
		return res.json({message : 'Please fill all fields'})
	}

	const isDateValid = check_date_input(date)
	if(isDateValid === false) {
		return res.json({message : 'Invalid date format'})
	}

	Staff.getStaffById(staffId, (err,result)=> {
		if(err) throw err;
		if(result.length === 0) {
			return res.json({message : 'Staff ID not found'}).status(404)
		} else {
			const staff = {
				name : name,
				position : position,
				shift : shift,
				date : date
			}
		
			Staff.update( staffId ,staff, (err,result)=> {
				if(err) throw err;
				console.log(result)
				return res.json({message : 'Successfully'})
			})
		}		
	})

}
