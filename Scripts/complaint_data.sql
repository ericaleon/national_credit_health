USE credit_health;
SET SQL_SAFE_UPDATES = 0;
SELECT * FROM complaints;

ALTER TABLE complaints ADD COLUMN state_id INT;
UPDATE complaints
INNER JOIN state_id_lookup on complaints.State = state_id_lookup.abbr
SET complaints.state_id = state_id_lookup.id;

ALTER TABLE `complaints` DROP COLUMN `State`;

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

SELECT complaints.state_id, COUNT(complaints.`Complaint ID`) / (state_data.state_population) * 10000 AS 'Complaints per 10,000 people', state_id_lookup.abbr AS 'State'
FROM complaints
INNER JOIN state_data ON complaints.state_id = state_data.state_id
INNER JOIN state_id_lookup ON complaints.state_id = state_id_lookup.id
GROUP BY state_id, state; 

SELECT complaints.state_id, COUNT(complaints.`Complaint ID`) / (state_data.state_population) * 10000 AS 'Complaints per 10,000 people', state_id_lookup.abbr AS 'State', complaints.product
FROM complaints
INNER JOIN state_data ON complaints.state_id = state_data.state_id
INNER JOIN state_id_lookup ON complaints.state_id = state_id_lookup.id
GROUP BY state_id, state, product; 