USE credit_health;
SET SQL_SAFE_UPDATES = 0;
SELECT * FROM complaints;

DELETE FROM complaints 
WHERE 
	product = "Credit reporting, credit repair services, or other personal consumer reports";

DELETE FROM complaints 
WHERE 
	product = "Credit card or prepaid card";
    
DELETE FROM complaints 
WHERE 
	product = "Payday loan, title loan, or personal loan";
    
DELETE FROM complaints 
WHERE 
	State IN ("AE", "AP", "AS", "FM", "GU", "MH", "MP", "PR", "PW", "VI", "");
    
SELECT COUNT("Complaint ID") FROM complaints;

SELECT State, COUNT(`Complaint ID`) AS 'Number of Complaints'
FROM complaints
GROUP BY State; 

SELECT State, COUNT(`Complaint ID`) AS 'Number of Complaints', Product
FROM complaints
GROUP BY State, Product; 