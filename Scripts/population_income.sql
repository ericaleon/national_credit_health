USE credit_health;
SET SQL_SAFE_UPDATES = 0;
SELECT * FROM credit_health.state_income;

DELETE FROM state_income 
WHERE 
	GeoName IN ("United States", "New England", "Mideast", "Great Lakes", "Plains", "Southeast", "Rocky Mountain", "Far West", "Southwest");
    
UPDATE state_income 
SET 
    Description = REPLACE(Description,
        'Population (persons) 1/',
        'Population');
        
UPDATE state_income 
SET 
    Description = REPLACE(Description,
        'Per capita personal income (dollars) 2/',
        'Income');
        
UPDATE state_income 
SET 
    GeoName = REPLACE(GeoName,
        'Alaska *',
        'Alaska');
        
UPDATE state_income 
SET 
    GeoName = REPLACE(GeoName,
        'Hawaii *',
        'Hawaii');
        
ALTER TABLE state_income ADD COLUMN State_Abb VARCHAR(2);
UPDATE state_income
INNER JOIN statelookup on state_income.GeoName = statelookup.StateName
SET state_income.State_Abb = statelookup.StateAbbrev;

ALTER TABLE `state_income` MODIFY State_Abb VARCHAR(2) AFTER GeoName;

DELETE FROM state_income 
WHERE 
	Description = "Population";