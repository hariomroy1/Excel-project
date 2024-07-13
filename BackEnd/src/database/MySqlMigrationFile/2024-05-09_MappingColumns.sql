use todoProject;

CREATE TABLE MappingColumns ( 
  Id INT AUTO_INCREMENT PRIMARY KEY,
  RecordId INT,
  UserColumn CHAR(30),
  InternalColumn CHAR(30),
  FOREIGN KEY (RecordId) REFERENCES IngestionRecords(Id)
);

Select *from MappingColumns;
