const inquirer = require('inquirer')
const mysql = require('mysql2')
const cTable = require('console.table')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
},
console.log('Connected to employee_db')
)

const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choices',
            choices: [
                'View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role'
            ]
        }
    ])

    .then((answers => {
        const {choices} = answers
        
        switch (answers) {
            case 'View all Departments':
                // function
                break;
        }
    }))
}



const viewDepartments = () => {
    const sql = `SELECT + FROM department`

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
            return
        } else {
            console.table(rows)
            init()
        }
    })
}











init()
