# National Credit Health

There's no debt about it, credit scores (and how they add up, or don't) can be a tough web to untangle. Who's the most credit savvy among us? Will your credit score rise as you earn more? Here we'll look at how much debt we have as a nation, where we carry our debt, credit score trends, and ask "Should we be giving our scores so much **_credit_**?". 


## Data Resources and Retrieval

* [Consumer Financial Protection Bureau](https://data.consumerfinance.gov/dataset/Consumer-Complaints/s6ew-h6mp) - SODA formatted data used to collect information on credit reporting complaints filed complaints in 2017. 

* [Experian - State of Credit](https://www.experian.com/blogs/ask-experian/state-of-credit/) -  Used table scraping collect data on the average credit score and credit card balance by state.

* [Value Penguin](https://www.valuepenguin.com/average-credit-card-debt) - Used table scraping collect data on the average credit card debt by age and income. 

* [Youth Financial Education](https://files.consumerfinance.gov/f/documents/cfpb_youth-financial-education_lit-review.pdf) - Information entered regarding financial education requirements across the country.

* [Consumer Finance Survey](https://www.federalreserve.gov/econres/scfindex.htm) - ETL data from the 4 types of debt (Auto, Credit, Mortgages, and Student Loans). 


## Built With

- Jupyter Notebook - Data Clean-up
- SQLite - Database Construction
- [Leaflet](https://leafletjs.com/) - Mapping the Choropleth
- [Plotly.js](https://plot.ly/javascript/) - Interactive Charts


## Mapping the Data

* An SVG chart was created with data scraped from ValuePenguin, using Jupyter Notebook and Beautiful Soup. Since these data sets were relatively small, the data was pulled in as variable objects in the html as inline javascript along with the code to chart them. We used multiple x-axes to allow users to visualize how both income and age might affect the nation's credit card debt.

![Bar Graph](https://github.com/emilyt1985/national_credit_health/blob/master/app/static/img/CCdebt.gif "barGraph")

* With information from consumerfinance.gov, Experian and the New York Fed Exchange each state was munged and cleaned using Python with Pandas and Jupyter Notebook. A sqlite database was then created based on the primary data and tables needed for our calculations and visualizations. One of these calculations was to determine an "overall financial wellness" score - this involved binning the average state records for credit score, debt to income ratio, and >90 days delinquent on mortgage loans. Based on these binned scores per state, we were able to assign an overall score per state (1-10) for financial health. In addition, we wanted users to be able to consider Financial education in each state and whether it may contribute to the overall score. Included in the state information, we've chosen to display the grade assigned to that state based on their graduation requirements regarding financial education. This data was pulled in for use via our flask application where we queried the sqlite database and created functions within both the flask app and javascript to assign colors based on scores, build the map and apply colors by state, as well as to create markers and related pop-up information for each state.

![Choropleth](https://github.com/emilyt1985/national_credit_health/blob/master/app/static/img/CHealth.gif)

* Data was gathered for this graph and cleaned (also via Python with Pandas and Jupyter Notebook) from the Consumer Financial Protection Bureau on complaints from 2017 for debt collection, payday lenders, vehicle loans, mortgage loans, student loans, credit reporting and credit cards. In the interest of time, we decided to narrow down complaint data those records specifically impacting Credit Reporting and Repair. This involved creating a python Flask route ('/complaints') where lists were created from SQLAlchemy queries which included calculations and a table join for both complaints data and overall state data. We were able to pull in data from this route via d3 and Plotly JS to create an interactive scatterplot to show how rate of complaints may or may not correlate with average credit scores in a given state. This data may be the hardest to extrapolate from since participation in the program is limited to those aware of it and therefore may not be an accurate representation of consumer complaints.

!(Bubble)[https://github.com/emilyt1985/national_credit_health/blob/master/app/static/img/D3.gif]

## Running the program

Simply ensure your environment has all necessary libraries (requirements.txt) and then launch the app.py and visit your local host to view the project in its entirety. 


## Authors

- [Emily Tavik](https://github.com/emilyt1985) 
- [Erica Leon](https://github.com/ericaleon)
- [Felicia Glover](https://github.com/fglover)
- [LaShanti Jones](https://github.com/LJonesCE) 
