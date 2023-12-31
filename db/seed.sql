-- uses the business_db database
USE business_db;

-- Seeds departments
INSERT INTO department(name)
VALUES('Sales'),
('Marketing'),
('Human Resources'),
('Operations');


-- Seeds Roles
INSERT INTO role(title, salary, department_id)
VALUES('Board', 150000.00, 4),
('Marketing Manager', 70000.00, 2),
('Marketing Assistant', 52000.00, 2),
('HR Manager', 60000.00, 3),
('Sales Staff', 45000.00, 1);

-- Seeds Employees
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('Samuel', 'Hernandez', 1, NULL),
('Michael', 'Newn', 4,2),
('Jonathan', 'Castillo', 4, 2),
('Jose', 'Mota', 4, 2),
('Marlyn', 'Sanchez', 3, 4),
('Martha', 'Garay', 2, 1),
('Ana', 'Williams', 4, 1),
('Juan', 'Gonzalez', 5, 2),
('Miguel', 'Lopez', 5, 2);