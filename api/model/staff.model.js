const db = require('../db') 
const shortid = require('shortid')

var Staff = function(staff) {
    this.id = shortid.generate();
    this.name = staff.name;
    this.position = staff.position;
    this.shift = staff.shift;
    this.date = staff.date
    this.status = true;
    this.createAt = new Date();
}

// Staff.getAllStaffs = (result) => {
//     const sql = 'SELECT * FROM staff';
//     db.query(sql, (err, staffList)=> {
//         if(err) {
//             result(null, err);
//         } else {
//             result(null, staffList);
//         }
//     }) 
// }

Staff.getAllStaffs = (result) => {
    const sql = 'SELECT name, date FROM staff';
    db.query(sql, (err, staffList)=> {
        if(err) {
            result(null, err);
        } else {
            result(null, staffList);
        }
    }) 
}

Staff.getStaffByName = (name, result) => {
    db.query(`SELECT * FROM staff WHERE name ='${name}'`, (err, res) => {
        if(err) {
            console.log(err)
            result(null, err);
        } else {
            result(null,res)
        }
    });
}

Staff.getStaffById = (staffId, result) => {
    db.query(`SELECT * FROM staff WHERE id ='${staffId}'`, (err, res) => {
        if(err) {
            console.log(err)
            result(null, err);
        } else {
            console.log(res)
            result(null,res)
        }
    });
}


Staff.save= (staff) => {
    db.query(`INSERT INTO staff SET ?`,staff, (error)=> {
        if(error) throw error; 
    })
}

Staff.isExist = (name, isTrue) => {
    Staff.getStaffByName(name, (err, result) => {
        if(err) throw err;
        if(result.length === 0) {
            isTrue(false)
        } else { isTrue(true) }       
    })
}

Staff.delete= (staffId, result) => {
    const sql = `DELETE FROM staff WHERE id= '${staffId}' `;
    db.query(sql, (err, res) => {
        if(err) console.log(err);
        result(null,res);
    })
}

Staff.update = ( staffID , staff , result) => {
    const sql = `UPDATE staff SET ? WHERE id = '${staffID}' `;
    db.query(sql, staff , (err, res)=> {
        if(err) {
            result(null, err);
        } else {
            result(null, res)
        }
    })
}

module.exports = Staff;