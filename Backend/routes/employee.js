var router = require('express').Router();
var connection = require ('../database');


// Get all Employee
router.get('/', (req, res)=>{
    let sql = "SELECT * FROM EMPLOYEE_INFO"
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

// Add Employee
router.post('/', (req,res)=>{
    let empId = req.body.empId;
    let Joined_Date = req.body.Joined_Date;
    let Employee_Name = req.body.Employee_Name;
    let Date_of_Birth = req.body.Date_of_Birth;
    let Ranking = req.body.Ranking;
    let Department = req.body.Department;
    let Gender = req.body.Gender;
    let Interest = req.body.Interest;
    let Phone = req.body.Phone;
    let Email = req.body.Email;
    let Address = req.body.Address;
    let Remark = req.body.Remark;

    connection.query(`SELECT COUNT(*) AS cnt FROM employee_info WHERE empId = ${empId}`, (err,data)=>{
        if(err){
            console.log(err);
        } 
        else{
            if(data[0].cnt > 0){
                res.json({success : false, message : "Employee ID Already Exist!"});
            }
            else{
                let sql = `INSERT INTO employee_info (empId, Joined_Date, Employee_Name, Date_of_Birth, Ranking, Department, Gender, Interest, Phone, Email, Address, Remark) VALUES ('${empId}', '${Joined_Date}', '${Employee_Name}', '${Date_of_Birth}', '${Ranking}', '${Department}', '${Gender}', '${Interest}', '${Phone}' ,'${Email}', '${Address}', '${Remark}')`;
                connection.query(sql, (err, result)=>{
                    if (err) throw err;
                    res.send(result);
                })
            }
        }
    });
});

// Update Employee
router.patch('/:id', (req,res)=>{
    const id = req.params.id;
    let empId = req.body.empId;
    let Joined_Date = req.body.Joined_Date;
    let Employee_Name = req.body.Employee_Name;
    let Date_of_Birth = req.body.Date_of_Birth;
    let Ranking = req.body.Ranking;
    let Department = req.body.Department;
    let Gender = req.body.Gender;
    let Interest = req.body.Interest;
    let Phone = req.body.Phone;
    let Email = req.body.Email;
    let Address = req.body.Address;
    let Remark = req.body.Remark;
    let sql = `UPDATE employee_info SET empId = '${empId}', Joined_Date = '${Joined_Date}', Employee_Name = '${Employee_Name}', Date_of_Birth = '${Date_of_Birth}', Ranking = '${Ranking}', Department = '${Department}', Gender = '${Gender}', Interest = '${Interest}', Phone = '${Phone}', Email = '${Email}', Address = '${Address}', Remark = '${Remark}' where empId = ${id}`;
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

// Delete Employee
router.delete('/:id',(req,res)=>{
    const id = req.params.id;
    let sql = `Delete from employee_info where empId = ${id}`;
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})


module.exports = router;