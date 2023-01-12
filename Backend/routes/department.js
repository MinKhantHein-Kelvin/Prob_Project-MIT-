var router = require('express').Router();
var connection = require ('../database');

router.get('/', (req,res)=>{
    let sql = "SELECT * FROM DEPARTMENT"
    connection.query(sql, (err, result)=>{
        if (err) throw err;
        res.send(result);
    })
})

module.exports = router;