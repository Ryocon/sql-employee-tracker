// importing dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
// const cTable didn't seem to bew required so shortened to just require
require("console.table");

// connection to the database made using mysql2
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employee_db",
  },
  console.log("Connected to employee_db")
);

// initial prompts for the user to navigate through
const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Quit",
        ],
      },
    ])

    .then((answers) => {

      switch (answers.choices) {
        case "View all Departments":
          viewDepartments();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployee();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateRole();
          break;
        case "Quit":
          db.end();
          break;
      }
    });
};

// function for viewing all departments
const viewDepartments = () => {
  const sql = "SELECT * FROM department";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
};

// function for viewing roles and the department the role belongs to
const viewRoles = () => {
  const sql =
    "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles JOIN department ON roles.department_id = department.id";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    init();
  });
};

// function for viewing employees which includes department and roles for each employee
// the mysql2 call here uses backticks as opposed to the quotes used throughout as this is what I originally used throughout and found this one fiddly to change away from backticks without breaking it
viewEmployee = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name,
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
    if (err) throw err;
    console.table(rows);
    init();
  });
};

// function to add a department
// uses .map to allow inquirer to navigate the options in the database
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the Department you would like to add?",
        name: "newDept",
        validate: (input) => {
          if (!input) {
            return "Please provide a Department name!";
          } else {
            return true;
          }
        },
      },
    ])
    .then((answers) => {
      const sql = "INSERT INTO department(name) VALUES (?)";

      db.query(sql, answers.newDept, (err, res) => {
        if (err) throw err;

        console.log("Department added");
        init();
      });
    });
};

// function to add a role, it's salary and the department it belongs to
// using .map for the same purpose as the addDepartment function
const addRole = () => {
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;

    let deptSelect = res.map((departmentName) => ({
      name: departmentName.name,
      value: departmentName.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the Role you would like to add?",
          name: "newRole",
          validate: (input) => {
            if (!input) {
              return "Please provide a Role name!";
            } else {
              return true;
            }
          },
        },
        {
          type: "input",
          message: "What is the salary for this Role?",
          name: "newSalary",
          validate: (input) => {
            if (!input) {
              return "Please provide a Salary!";
            } else {
              return true;
            }
          },
        },
        {
          type: "list",
          message: "What Department does this Role belong to?",
          name: "newRoleDept",
          choices: deptSelect,
        },
      ])

      .then((answers) => {
        const sql =
          "INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)";

        db.query(
          sql,
          [answers.newRole, answers.newSalary, answers.newRoleDept],
          (err, res) => {
            if (err) throw err;
            console.log("Department added");
            init();
          }
        );
      });
  });
};

// function to add an employee and their role
const addEmployee = () => {
  db.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;

    let roleSelect = res.map((roleName) => ({
      name: roleName.title,
      value: roleName.id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          message:
            "What is the first name of the Employee you would like to add?",
          name: "firstName",
          validate: (input) => {
            if (!input) {
              return "Please provide a name!";
            } else {
              return true;
            }
          },
        },
        {
          type: "input",
          message:
            "What is the last name of the Employee you would like to add?",
          name: "lastName",
          validate: (input) => {
            if (!input) {
              return "Please provide a name!";
            } else {
              return true;
            }
          },
        },
        {
          type: "list",
          message: "What is the role of the Employee you would like to add?",
          name: "empRole",
          choices: roleSelect,
        },
      ])

      .then((answers) => {
        const sql =
          "INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?)";

        db.query(
          sql,
          [answers.firstName, answers.lastName, answers.empRole],
          (err, res) => {
            if (err) throw err;
            console.log("New Employee Added!");
            init();
          }
        );
      });
  });
};

// function to update an employee role
const updateRole = () => {
  db.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;

    let updateRole = res.map((upRole) => ({
      name: upRole.title,
      value: upRole.id,
    }));

    db.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;

      let updateEmp = res.map((upEmp) => ({
        name: upEmp.first_name + " " + upEmp.last_name,
        value: upEmp.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "What is name of the Employee you would to update?",
            name: "empName",
            choices: updateEmp,
          },
          {
            type: "list",
            message: "What is the Role you would like this Employee to have?",
            name: "upRole",
            choices: updateRole,
          },
        ])

        .then((answers) => {
          const sql = "UPDATE employee SET ? WHERE ?";

          db.query(
            sql,
            [{ role_id: answers.upRole }, { id: answers.empName }],
            (err, res) => {
              if (err) throw err;
              console.log("Employee Role has been updated!");
              init();
            }
          );
        });
    });
  });
};

// initialises inquirer
init();
