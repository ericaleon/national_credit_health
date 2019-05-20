SELECT * FROM credit_health.state_data;

ALTER TABLE state_data ADD COLUMN State_Abb VARCHAR(2);
UPDATE state_data
INNER JOIN statelookup on state_data.State = statelookup.StateName
SET state_data.State_Abb = statelookup.StateAbbrev;

SELECT * FROM credit_health.state_data;

ALTER TABLE `state_data` CHANGE COLUMN `Average VantageScore` `Vantage_Score` INT(10) NOT NULL;

ALTER TABLE `state_data` MODIFY State_Abb VARCHAR(2) AFTER State;

ALTER TABLE state_data ADD COLUMN Auto_Del DOUBLE, ADD COLUMN CC_Del DOUBLE, ADD COLUMN Mor_Del DOUBLE, ADD COLUMN Stu_Del DOUBLE;
UPDATE state_data
INNER JOIN statedelinquency on state_data.State_Abb = statedelinquency.state
SET state_data.Auto_Del = statedelinquency.`Auto Delinquency`, state_data.CC_Del = statedelinquency.`Credit Card Delinquency`, state_data.Mor_Del = statedelinquency.`Mortgage Delinquency`, state_data.Stu_Del = statedelinquency.`Student Loan Delinquency`;
 
ALTER TABLE state_data ADD COLUMN Auto_Debt DOUBLE, ADD COLUMN CC_Debt DOUBLE, ADD COLUMN Mor_Debt DOUBLE, ADD COLUMN Stu_Debt DOUBLE;
UPDATE state_data
INNER JOIN statedebt on state_data.State_Abb = statedebt.state
SET state_data.Auto_Debt = statedebt.`Auto Debt`, state_data.CC_Debt = statedebt.`Credit Card Debt`, state_data.Mor_Debt = statedebt.`Mortgage Debt`, state_data.Stu_Debt = statedebt.`Student Loan Debt`;

ALTER TABLE state_data ADD COLUMN Total_Debt DOUBLE;
UPDATE state_data
INNER JOIN statedebt on state_data.State_Abb = statedebt.state
SET state_data.Total_Debt = statedebt.`Total Debt`;

SELECT state_data.State_Abb, ROUND((state_data.Total_Debt / state_income.Income) * 100, 0) AS 'Debt_Income(%)'
FROM state_data
INNER JOIN state_income
ON state_data.State_Abb = state_income.State_Abb
GROUP BY State; 