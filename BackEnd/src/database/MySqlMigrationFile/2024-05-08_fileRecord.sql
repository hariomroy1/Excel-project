create database todoProject;

use todoProject;

CREATE TABLE IngestionRecords (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  UserName varchar(50),
  FileName varchar(50),
  FileUri varchar(300),
  Status varchar(30),
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO IngestionRecords (UserName, FileName, FileUri, Status)
VALUES ('user123', 'example.xlsx', 'https://example.com/files/example.xlsx', 'stored');

select *from IngestionRecords;