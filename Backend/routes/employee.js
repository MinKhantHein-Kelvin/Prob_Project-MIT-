var router = require('express').Router();
var connection = require ('../database');
var multer  = require('multer');
var path = require ('path');
const { json } = require('body-parser');

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
})

// Add Employee
router.post('/', upload.single('Image'), (req,res)=>{
    let imagePath = req.body.Image;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/Image/"+ req.file.filename;
    }

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
    let Image = imagePath;
    let Leave = JSON.parse(req.body.Leave);//[{"id":0,"Leave_Type":"Annual Leave","From_Date":"2023-01-28","To_Date":"2023-01-28","Days":1,"Reason":"fdfwerrfe"}];
    
    // let Leave_Type = req.body.Leave_Type;
    // let From_Date = req.body.From_Date;
    // let To_Date = req.body.To_Date;
    // let Days = req.body.Days;
    // let Reason = req.body.Reason;
   
    connection.query(`SELECT COUNT(*) AS cnt FROM employees_information WHERE empId = '${empId}'`, (err,data)=>{
        if(err){
            console.log(err);
        } 
        else{
            if(data[0].cnt > 0){
                res.json({success : false, message : "Employee ID Already Exist!"});
            }
            else{
                let sql = `INSERT INTO employees_information (empId, Joined_Date, Employee_Name, Date_of_Birth, Ranking, Department, Gender, Interest, Phone, Email, Address, Remark, Image) VALUES ('${empId}', '${Joined_Date}', '${Employee_Name}', '${Date_of_Birth}', '${Ranking}', '${Department}', '${Gender}', '${Interest}', '${Phone}' ,'${Email}', '${Address}', '${Remark}', '${Image}')`;
                connection.query(sql, (err, result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{   
                        for(let i=0; i< Leave.length; i++){
                            // console.log(Leave[i].id);
                            let leaveQuery = `insert into leave_information(Leave_Type, From_Date, To_Date, Days, Reason, empId) values ( '${Leave[i].Leave_Type}', '${Leave[i].From_Date}', '${Leave[i].To_Date}', '${Leave[i].Days}','${Leave[i].Reason}', '${empId}')`;
                            connection.query(leaveQuery,(err,result)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("Leave adding succesful!");
                                }
                            });
                        }                       
                        return res.json({result : result ,leave: Leave,success : true, message : "New Employee adding succesful!"});
                       
                        
                    }
                });


            }
        }
    });
});


// Get all Employee
router.get('/', (req, res)=>{
    let sql = "SELECT * FROM employees_information"
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

//Get all Leave
router.get('/leave', (req,res)=>{
    let sql = "select * from leave_information"
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})


// Update Employee
router.patch('/:id', upload.single('Image'), (req,res)=>{
    let imagePath = req.body.Image;
    if(req.file){
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/Image/"+ req.file.filename;
    }
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
    let Image = imagePath;
    let Leave = JSON.parse(req.body.Leave);

    let sql = `UPDATE employees_information SET empId = '${empId}', Joined_Date = '${Joined_Date}', Employee_Name = '${Employee_Name}', Date_of_Birth = '${Date_of_Birth}', Ranking = '${Ranking}', Department = '${Department}', Gender = '${Gender}', Interest = '${Interest}', Phone = '${Phone}', Email = '${Email}', Address = '${Address}', Remark = '${Remark}', Image = '${Image}' where empId = '${id}'`;
    connection.query(sql, (err, result)=>{
        if(err){
            console.log(err);
        }else{
            let leaveDel = `Delete from leave_information where empId = '${id}'`
            connection.query(leaveDel, (err, result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                }
            }); 
            for(let i=0; i< Leave.length; i++){
                let leaveQuery = `insert into leave_information(Leave_Type, From_Date, To_Date, Days, Reason, empId) values ( '${Leave[i].Leave_Type}', '${Leave[i].From_Date}', '${Leave[i].To_Date}', '${Leave[i].Days}','${Leave[i].Reason}', '${empId}')`
                connection.query(leaveQuery,(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Leave editing succesful!");
                    }
                });
            }    
            res.json({result : result ,success : true, message : "Employee Editing succesful!"});
        }
    })
});

// Delete Employee
router.delete('/:id',(req,res)=>{
    const id = req.params.id;
    let sql = `Delete from employees_information where empId = '${id}'`;
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
});

//importExcel
router.post('/import', (req,res)=>{
    let excelData = req.body;
    for(let i=0; i< excelData.length; i++){
        let importQuery = `INSERT INTO employees_information (empId, Joined_Date, Employee_Name, Date_of_Birth, Ranking, Department, Gender, Interest, Phone, Email, Address, Remark, Image) VALUES ('${excelData[i].empId}', '${excelData[i].Joined_Date}', '${excelData[i].Employee_Name}', '${excelData[i].Date_of_Birth}', '${excelData[i].Ranking}', '${excelData[i].Department}', '${excelData[i].Gender}', '${excelData[i].Interest}', '${excelData[i].Phone}' ,'${excelData[i].Email}', '${excelData[i].Address}', '${excelData[i].Remark}', '${excelData[i].Image}')`; 
        connection.query(importQuery,(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("Import Data succesful!");
            }
        });
    }
})


module.exports = router;