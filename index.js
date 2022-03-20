const inquirer = require('inquirer')
const mysql = require('mysql2')
// const cTable = 
require('console.table')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_db'
},
console.log('Connected to employee_db')
)

const init = async () => {
    await inquirer.prompt([
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
        },
        console.log('test')
    ])

    .then((answers => {
        console.log('then running')
        // const {choices} = answers
        
        switch (answers.choices) {
            case 'View all Departments':
                viewDepartments()
                break;
        }
    }))
}



const viewDepartments = () => {
    const sql = `SELECT * FROM department`

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
