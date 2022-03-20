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
                'Update an Employee Role',
                'Quit'
            ]
        },
    ])

    .then((answers) => {
        console.log('then running')
        // const {choices} = answers
        
        switch (answers.choices) {
            case 'View all Departments':
                viewDepartments()
                break;
            case 'View all Roles':
                viewRoles()
                break;
            case 'View all Employees':
                viewEmployee()
                break;
            case 'Quit':
                db.end()
                break;
        }
    })
}



const viewDepartments = async () => {
    const sql = `SELECT * FROM department`;

   await db.query(sql, (err, rows) => {
        if (err) {
            throw err
        } else {
            console.table(rows)
            init()
        }
    })
}

const viewRoles = () => {
    const sql = `SELECT 
    roles.id,
    roles.title,
    department.name AS department,
    roles.salary
    FROM roles
    JOIN department ON roles.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        } else {
            console.table(rows)
            init()
        }
    })
}

viewEmployee = () => {
    const sql = `SELECT 
    employee.id,
    employee.first_name,
    employee.last_name,
    roles.title, 
    department.name AS department, 
    roles.salary,
    CONCAT (manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN roles ON employee.role_id = roles.id
    JOIN department ON roles.department_id = department.id
    LEFT JOIN employee manager on employee.manager_id = manager.id
    `;

    db.query(sql, (err, rows) => {
        if (err) {
            throw err
        } else {
            console.table(rows)
            init()
        }
    })
}





init()
