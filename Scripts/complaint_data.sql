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

SELECT complaints.State, COUNT(complaints.`Complaint ID`) / (state_population.Population) * 10000 AS 'Complaints per 10,000 people'
FROM complaints
INNER JOIN state_population
ON complaints.State = state_population.State
GROUP BY State; 

SELECT complaints.State, COUNT(complaints.`Complaint ID`) / (state_population.Population) * 10000 AS 'Complaints per 10,000 people', complaints.Product
FROM complaints
INNER JOIN state_population
ON complaints.State = state_population.State
GROUP BY State, Product; 