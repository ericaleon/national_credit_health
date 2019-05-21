SELECT * FROM credit_health.state_data;

ALTER TABLE state_data ADD COLUMN state_id INT AFTER `State_Abb`;
UPDATE state_data
INNER JOIN state_id_lookup on state_data.State_Abb = state_id_lookup.abbr
SET state_data.state_id = state_id_lookup.id;

ALTER TABLE state_data DROP COLUMN `State`;

ALTER TABLE state_data DROP COLUMN `State_Abb`;

SELECT * FROM credit_health.state_data;

ALTER TABLE `state_data` CHANGE COLUMN `Average VantageScore` `Vantage_Score` INT(10) NOT NULL;

ALTER TABLE `state_data` MODIFY State_Abb VARCHAR(2) AFTER State;

ALTER TABLE state_data ADD COLUMN Auto_Del DECIMAL(5,3), ADD COLUMN CC_Del DECIMAL(5,3), ADD COLUMN Mor_Del DECIMAL(5,3), ADD COLUMN Stu_Del DECIMAL(5,3);
UPDATE state_data
INNER JOIN statedelinquency on state_data.state_id = statedelinquency.state_id
SET state_data.Auto_Del = statedelinquency.`Auto Delinquency`, state_data.CC_Del = statedelinquency.`Credit Card Delinquency`, state_data.Mor_Del = statedelinquency.`Mortgage Delinquency`, state_data.Stu_Del = statedelinquency.`Student Loan Delinquency`;
 
ALTER TABLE state_data ADD COLUMN Auto_Debt INT(5), ADD COLUMN CC_Debt INT(5), ADD COLUMN Mor_Debt INT(5), ADD COLUMN Stu_Debt INT(5);
UPDATE state_data
INNER JOIN statedebt on state_data.state_id = statedebt.state_id
SET state_data.Auto_Debt = statedebt.`Auto Debt`, state_data.CC_Debt = statedebt.`Credit Card Debt`, state_data.Mor_Debt = statedebt.`Mortgage Debt`, state_data.Stu_Debt = statedebt.`Student Loan Debt`;

ALTER TABLE state_data ADD COLUMN Total_Debt DOUBLE;
UPDATE state_data
INNER JOIN statedebt on state_data.State_Abb = statedebt.state
SET state_data.Total_Debt = statedebt.`Total Debt`;

ALTER TABLE state_data ADD COLUMN income DOUBLE;
UPDATE state_data
INNER JOIN state_income on state_data.state_id = state_income.state_id
SET state_data.income = state_income.`Income`;

SELECT state_data.state_id, ROUND((state_data.Total_Debt / state_income.Income) * 100, 0) AS 'Debt_Income';

UPDATE state_data
SET Debt_Income = ROUND((state_data.Total_Debt / state_data.Income) * 100, 0);

ALTER TABLE state_data ADD COLUMN state_population INT;
UPDATE state_data
INNER JOIN state_population on state_data.state_id = state_population.state_id
SET state_data.state_population = state_population.Population;

ALTER TABLE state_data ADD COLUMN score INT(3) AFTER state_id;


    
SELECT Vantage_Score
FROM state_data
	IF Vantage_Score > 653 THEN
	SET score += 1
	LSEIF state_data.Vantage_Score 




