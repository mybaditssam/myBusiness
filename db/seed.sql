USE company_db;

INSERT INTO departments(name)
VALUES('Sales'),
('Marketing'),
('Human Resources'),
('Operations');

INSERT INTO roles(title, salary, department_id)
VALUES('CEO', 150000.00, 4),
('Marketing Manager', 70000.00, 2),
('Marketing Assistant', 52000.00, 2),
('HR Manager', 60000.00, 3),
('Sales Staff', 45000.00, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Samuel', 'Hernandez', 1, NULL),
('Michael', 'Newn', 4,2),
('Jonathan', 'Castillo', 4, 2),
('Jose', 'Mota', 4, 2),
('Marlyn', 'Sanchez', 3, 4),
('Martha', 'Garay', 2, 1),
('Ana', 'Williams', 4, 1),
('Juan', 'Gonzalez', 5, 2),
('Miguel', 'Lopez', 5, 2);