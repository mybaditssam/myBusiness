const inquirer = require('inquirer');
require("console.table");
const connection = require('./connection/connection.js')

const Menu = () => {
    // prompts to start
    inquirer
      .prompt({
        name: "start",
        type: "list",
        message: "What would you like to do",
        choices: [
          "View Employees", 
          "View Employees By Department", 
          "View Employees By Manager", 
          "Add Employee", 
          "Remove Employee", 
          "Update Employee Role", 
          "Update Employee Manager", 
          "View Roles", 
          "Add Role", 
          "Remove Role", 
          "View Departments", 
          "Add Department", 
          "Remove Department", 
          "View Total Utilized Budget of a Department", 
          "Exit", 
        ],
      })
      .then((answer) => {
        switch (answer.start) {
          case "View Employees":
            ViewAllEmployees();
            break;
  
          case "View Employees By Department":
            ViewAllEmployeesByDepartment();
            break;
  
          case "View Employees By Manager":
            ViewAllEmployeesByManager();
            break;
  
          case "Add Employee":
            AddEmployee();
            break;
  
          case "Remove Employee":
            RemoveEmployee();
            break;
  
          case "Update Employee Role":
            UpdateEmployeeRole();
            break;
  
          case "Update Employee Manager":
            UpdateEmployeeManager();
            break;
  
          case "View Roles":
            ViewAllRoles();
            break;
  
          case "Add Role":
            AddRole();
            break;
  
          case "Remove Role":
            RemoveRole();
            break;
  
          case "View Departments":
            ViewAllDepartments();
            break;
  
          case "Add Department":
            AddDepartment();
            break;
  
          case "Remove Department":
            RemoveDepartment();
            break;
  
          case "View Total Utilized Budget of a Department":
            ViewTotalUtilizedBudgetByDepartment();
            break;
  
          case "Exit":
            Exit();
            break;
        }
      });
  };
  
  // View All Employees by query details
  function ViewAllEmployees() {
    const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 
    department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employee 
    LEFT JOIN role ON 
    employee.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id 
    LEFT JOIN employee manager ON 
    manager.id = employee.manager_id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      Menu();
    });
  }
  
  // See employess by department
function ViewAllEmployeesByDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to view?",
      choices: ["Sales", "Marketing", "Human Resources", "Operations"],
    })
    .then((answer) => {
      switch (answer.department) {
        case "Sales":
          return myViewEmployeesByDepartment("Sales");
        case "Marketing":
          return myViewEmployeesByDepartment("Marketing");
        case "Human Resources":
          return myViewEmployeesByDepartment("Human Resources");
        case "Operations":
          return myViewEmployeesByDepartment("Operations");
        default:
          console.log("Invalid department choice");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });

    // Function Display employees by the department they are in
    function myViewEmployeesByDepartment(department) {
      const query = `
       SELECT employee.id, 
       employee.first_name, 
       employee.last_name, 
       role.title, 
       department.name AS department 
       FROM employee 
       LEFT JOIN role ON employee.role_id = role.id 
       LEFT JOIN department ON role.department_id = department.id 
       WHERE department.name = ?;`;
      connection.query(query, department, (err, data) => {
        if (err) throw err;
        console.table(data);
        Menu();
      });
    }
  }
  
  // Function to see all employees by the Manager assignediewAllEmployeesByManager() {
  function V
    const query = `SELECT 
     employee.id, 
     employee.first_name, 
     employee.last_name, 
     role.title, 
     department.name AS 
     department, 
     CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
     FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id 
     LEFT JOIN employee manager ON manager.id = employee.manager_id 
     ORDER BY manager;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      Menu();
    });
  }
  

  // Function to insert an employee to DB
  function AddEmployee() {
    let userInput1;
    const query = `SELECT id, title FROM role WHERE title NOT LIKE '%Manager%';`;
  
    Promise.resolve()
      .then(() => {
        return new Promise((resolve, reject) => {
          connection.query(query, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      })
      .then((rolesData) => {

        const roles = rolesData.map(
          (item) => `Role title: ${item.title}, Role ID: ${item.id}`
        );
  
        return inquirer.prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's role id?",
            choices: roles,
          },
        ]);
      })
      .then((answer) => {
        // console.log("answer1", answer); //returns { first_name: 'a', last_name: 'b', role: 'Salesperson' }
        userInput1 = answer;
        // display manager id, first name, last name as managers
        const query2 = `SELECT 
        manager.id as manager_id,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN employee AS manager ON manager.id = employee.manager_id 
        WHERE manager.id IS NOT NULL
        GROUP BY manager_id;`;
        return new Promise((resolve, reject) => {
          connection.query(query2, (err, data) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
      })
      .then((managersData) => {
        //console.log("line 256 @@@", managersData);
        // make a new array to store all manager names
        const managers = managersData.map(
          (item) => `${item.manager_name} ID:${item.manager_id}`
        );
  
        return inquirer.prompt([
          {
            name: "manager",
            type: "list",
            message: "Which manager is the employee under?",
            choices: [...managers, "None"],
          },
        ]);
      })
      .then((answer) => {
        //console.log("line 274 answer2", userInput1,answer);
        // add ee to db based on user input
        const query = `INSERT INTO employee 
        (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`;
        // console.log("answer3", answer); // returns manager's role by user input
        connection.query(
          query,
          [
            userInput1.first_name,
            userInput1.last_name,
            userInput1.role.split("ID: ")[1],
            answer.manager.split("ID:")[1],
          ],
          //console.log("###",[userInput1.first_name, userInput1.role.split('ID: ')[1], answer.manager.split('ID:')[1]]),
          (err, data) => {
            if (err) throw err;
            console.log(
              `Added ${userInput1.first_name} ${userInput1.last_name} to the database`
            );
            ViewAllEmployees();
          }
        );
      });
  }
  
  // ============ remove employee: NOT removed===========
  function RemoveEmployee() {
    // remove ee: first name, last name, role, manager
    // --- ee array needed, for user to remove from
    // --- new prompt to give hint for user's input needed
    const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 
    department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS 
    manager FROM 
    employee LEFT JOIN role ON 
    employee.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id LEFT JOIN 
    employee manager ON 
    manager.id = employee.manager_id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      const employees = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      inquirer
        .prompt({
          name: "employee",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: [...employees],
        })
        .then((answer) => {
          const query = `DELETE FROM employee WHERE first_name = ? AND last_name = ?`;
          connection.query(
            query,
            [answer.employee.split(" ")[0], answer.employee.split(" ")[1]],
            (err, data) => {
              // console.log("line 340", data);
              if (err) throw err;
              console.log(
                `You have removed ${answer.employee} from the database.`
              );
              ViewAllEmployees();
            }
          );
        });
    });
  }
  
  // ========== update employee role ==========
  function UpdateEmployeeRole() {
    // show all ee's as a list
    const query = `SELECT first_name, last_name FROM employee;`;
    connection.query(query, (err, data) => {
      // map all ee's to an array
      const employees = data.map(
        (item) => `${item.first_name} ${item.last_name}`
      );
      // prompt user to select an ee to update
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: employees,
          },
        ])
        .then((answer) => {
          // get the selected employee's first and last name
          const selectedEmployee = answer.employee.split(" ");
          const firstName = selectedEmployee[0];
          const lastName = selectedEmployee[1];
  
          // New Query for the role table to get all available roles
          const query = `SELECT title FROM role;`;
          connection.query(query, (err, data) => {
            const roles = data.map((item) => item.title);
            // prompts to seelct role
            inquirer
              .prompt({
                name: "role",
                type: "list",
                message: "What is the employee's new role?",
                choices: roles,
              })
              .then((answer) => {
                // get the selected role's id
                const query = `SELECT id FROM role WHERE title = ?`;
                connection.query(query, [answer.role], (err, data) => {
                  if (err) throw err;
                  const roleId = data[0].id;
                  // update the employee's role in the database
                  const query = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
                  connection.query(
                    query,
                    [roleId, firstName, lastName],
                    (err, data) => {
                      if (err) throw err;
                      console.log(
                        `Successfully updated ${firstName} ${lastName}'s role to ${answer.role}.`
                      );
                      ViewAllEmployees();
                    }
                  );
                });
              });
          });
        });
    });
  }
  
  // ========== update employee manager ==========
  function UpdateEmployeeManager() {
    // show all ee's as a list
    const query = `SELECT first_name, last_name FROM employee;`;
    connection.query(query, (err, data) => {
    // map all ee's to an array
    const employees = data.map(
      (item) => `${item.first_name} ${item.last_name}`
    );
    // prompt user to select an ee to update
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((answer) => {
        // console.log("line 400+ &&&", answer); // returns the selected employee
        // get the selected employee's first and last name
        const selectedEmployee = answer.employee.split(" ");
        const firstName = selectedEmployee[0];
        const lastName = selectedEmployee[1];
   
        // query all managers 
        const query = `SELECT 
        first_name, last_name 
        FROM employee 
        WHERE manager_id IS NULL 
        AND first_name != '${firstName}' 
        AND last_name != '${lastName}';`;
        connection.query(query, (err, data) => {
          //console.log("line 400+ ***", data); 
          // map all managers to an array
          const managers = data.map(
            (item) => `${item.first_name} ${item.last_name}`
          );
          // prompt the user to select a new manager
          inquirer
            .prompt({
              name: "manager",
              type: "list",
              message: "Who is the employee's new manager?",
              choices: managers,
            })
            .then((answer) => {
              // get the selected manager's id
              const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
              connection.query(query, [answer.manager.split(" ")[0], answer.manager.split(" ")[1]], (err, data) => {
                if (err) throw err;
                const managerId = data[0].id;
                // update the employee's manager in the database
                const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;
                connection.query(
                  query,
                  [managerId, firstName, lastName],
                  (err, data) => {
                    if (err) throw err;
                    console.log(
                      `Successfully updated ${firstName} ${lastName}'s manager to ${answer.manager}.`
                    );
                    ViewAllEmployees();
                  }
                );
              });
            });
        }
      );
    });
  });
  }
  
  // ==========view all roles===========
  function ViewAllRoles() {
    // all roles: id, title, salary, department
    // display all roles in terminal with console.table
    const query = `SELECT 
     role.id, 
     role.title, 
     role.salary, 
     department.name AS department 
     FROM role 
     LEFT JOIN department ON 
     role.department_id = department.id;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      Menu();
    });
  }
  
  // ==========add role===========
  function AddRole() {
    // add role: title, salary, department
    const query = `SELECT department.name FROM department`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      // make a new array to store all department names
      const departments = data.map((item) => `${item.name}`);
      // --- new prompt to give hint for user's input needed
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "What is the title of the role?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
          },
          {
            // display all department name as choices
            type: "list",
            name: "department_name",
            message: "What is the department of the role?",
            choices: [...departments],
          },
        ])
        .then((data) => {
          const { title, salary, department_name } = data;
          connection.query(
            `INSERT INTO role (title, salary, department_id)
               SELECT ?, ?, department.id
               FROM department
               WHERE department.name = ?`,
            [title, salary, department_name],
            (err, res) => {
              if (err) throw err;
              console.log(
                `\n-------------------\n Role ${title} has been added!\n`
              );
              ViewAllRoles();
            }
          );
        });
    });
  }
  
  // ==========remove role===========
  function RemoveRole() {
    // prompt user to select role to remove
    // remove role: title, salary, department
    connection.query("SELECT role.title FROM role", (err, data) => {
      // console.log(data)
      const roles = data.map((item) => `${item.title}`);
      // console.log(roles);
  
      inquirer
        .prompt([
          {
            type: "list",
            name: "title",
            message: "Select a role you want to remove?",
            choices: [...roles],
          },
        ])
        .then((data) => {
          // console.log(data.title);
          const { title } = data;
  
          // Check if role exists. If not, display a message. If yes, delete the role.
          connection.query(
            "SELECT * FROM role WHERE title = '" + title + "'",
            (err, res) => {
              if (err) throw err;
              if (res.length === 0) {
                console.log(`Role with title ${data.title} does not exist.`);
              }
  
              if (res.length !== 0) {
                connection.query(
                  "DELETE FROM role WHERE title = '" + title + "'",
                  (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows === 0) {
                      console.log(
                        `Role with title ${data.title} does not exist.`
                      );
                    } else {
                      console.table({
                        message: `\n-------------------\n Role with title ${data.title} has been removed.\n`,
                        affectedRows: res.affectedRows,
                      });
                      ViewAllRoles();
                    }
                  }
                );
              }
            }
          );
        });
    });
  }
  
  // ========= view all departments ==========
  function ViewAllDepartments() {
    // all departments: id, name
    const query = `SELECT 
    department.id, 
    department.name FROM 
    department;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      Menu();
    });
  }
  
  // ========= add department ==========
  function AddDepartment() {
    // add department: name
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
        },
      ])
      .then((data) => {
        const { name } = data;
        connection.query(
          `INSERT INTO department (name) VALUES (?)`,
          [name],
          (err, res) => {
            if (err) throw err;
            console.log(
              `\n-------------------\n Department ${name} has been added!\n`
            );
            ViewAllDepartments();
          }
        );
      });
  }
  
  // ========= remove department ==========
  function RemoveDepartment() {
    // remove department: name
    // prompt user to select department to remove
    connection.query("SELECT department.name FROM department", (err, data) => {
      // make a new array to store all department names
      const departments = data.map((item) => `${item.name}`);
      // --- new prompt to give hint for user's input needed
      inquirer
        .prompt([
          {
            type: "list",
            name: "name",
            message: "Select a department you want to remove?",
            choices: [...departments],
          },
        ])
        .then((data) => {
          const { name } = data;
  
          // Check if department exists. If not, display a message. If yes, delete the department.
          connection.query(
            "SELECT * FROM department WHERE name = '" + name + "'",
            (err, res) => {
              if (err) throw err;
              if (res.length === 0) {
                console.log(`Department with name ${data.name} does not exist.`);
              }
  
              if (res.length !== 0) {
                connection.query(
                  "DELETE FROM department WHERE name = '" + name + "'",
                  (err, res) => {
                    if (err) throw err;
                    if (res.affectedRows === 0) {
                      console.log(
                        `Department with name ${data.name} does not exist.`
                      );
                    } else {
                      console.table({
                        message: `\n-------------------\n Department with name ${data.name} has been removed.\n`,
                        affectedRows: res.affectedRows,
                      });
                      ViewAllDepartments();
                    }
                  }
                );
              }
            }
          );
        });
    });
  }
  
  // ============ total utilized budget of a department ===========
  function ViewTotalUtilizedBudgetByDepartment() {
    // total budget: department, sum of salaries
    const query = `SELECT department.name AS department, 
     SUM(role.salary) AS utilized_budget FROM employee 
     LEFT JOIN role ON employee.role_id = role.id 
     LEFT JOIN department ON role.department_id = department.id 
     GROUP BY department.name;`;
    connection.query(query, (err, data) => {
      if (err) throw err;
      console.table(data);
      Menu();
    });
  }
  
  // ===== Exit the application =====
  function Exit() {
    console.log("Goodbye!");
    connection.end();
  }
  
  Menu();