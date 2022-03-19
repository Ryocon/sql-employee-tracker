INSERT INTO department(name)
VALUES 
('Sales'),
('Accounts'),
('Marketing'),
('Engineering');

INSERT INTO roles(title, salary, department_id)
VALUES 
('Salesperson', '50000', 1),
('Senior Salesperson', '80000', 1),
('Accountant', '60000', 2),
('Account Manager', '90000', 2),
('Social Media Specialist', '45000', 3),
('Marketer', '42000', 3),
('Front End Developer', '90000', 4),
('Back End Developer', '92000', 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Michael', 'Scott', 1, NULL),
('Jim', 'Halpert', 2, 1),
('Anglea', 'Martin', 3, NULL),
('Oscar', 'Martinez', 4, 3),
('Daryll', 'Philbin', 5, NULL),
('Aimee', 'Scanlon', 6, 5),
('Dwight' 'Schrute', 7, NULL),
('Tony', 'Stark', 8, 7);





        