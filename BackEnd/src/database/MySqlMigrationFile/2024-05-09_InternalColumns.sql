use todoProject;

CREATE TABLE InternalColumns ( 
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(30) UNIQUE,
  Type ENUM('Mandatory', 'Optional') DEFAULT 'Optional'
);

Select *from InternalColumns;



