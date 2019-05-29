# import dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy


# DB Setup
###########
engine = create_engine('sqlite:///../Database/credit_health.db?check_same_thread=False')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
Complaints = Base.classes.complaint_full
State_data = Base.classes.full_state_data
State_lookup = Base.classes.state_lookup

# Create our session (link) from Python to the DB
session = Session(engine)

#####end db setup######

# Flask Setup & routes
app = Flask(__name__)

@app.route('/')
def home():
    """Render Home Page."""
    return render_template("index.html")


@app.route('/statedata')
def statedata():
    """Return lists of credit and debt data for each state"""
    results = session.query(State_data.abbr,State_data.score,State_data.Vantage_Score,
        State_data.Debt_Income, State_data.Mor_Del, State_data.grade).all()

    all_states = []
    for abbr, score, vantage, debt_inc, mort_del, grade in results:
        states_dict = {}
        states_dict["State"] = abbr
        states_dict["Financial_Score"] = score
        states_dict["Credit_Score"] = vantage
        states_dict["Debt-Income"] = debt_inc
        states_dict["Mortg_Delinquency"] = mort_del
        states_dict["Ed_Grade"] = grade
        all_states.append(states_dict)

    return jsonify(all_states)


@app.route('/complaints')
def complaints():
    """Return consumer financial protection bureau complaint data"""
    # **mySQL Query for Complaint Counts by Type for each State**
    # SELECT abbr, Product, COUNT(Complaint_ID)
    # FROM complaints
    # GROUP BY abbr, Product
    # ORDER BY abbr ASC;

    # **Main mySQL Query**
    # SELECT complaint_full.abbr, full_state_data.Vantage_Score, COUNT(complaint_full.Complaint_ID) as `Total Complaints`, COUNT(complaint_full.Complaint_ID)*10000/full_state_data.state_population as `complaints per 10,000`, full_state_data.state_population
    # FROM complaint_full
    # INNER JOIN full_state_data
    # ON complaint_full.abbr = full_state_data.abbr
    # GROUP BY complaint_full.abbr;

    # sub-query for Complaint count by Product Type
    subq = session.query(Complaints.abbr, Complaints.Product, func.count(Complaints.Product).\
        group_by(Complaints.abbr, Complaints.Product).order_by(Complaints.abbr.asc()).all()
    
    # Main query to capture State abbreviation, Credit Score, Total Complaints, Complaints per 10,000 people
    query = session.query(Complaints.abbr, State_data.Vantage_Score, Complaints.state_population, func.count(Complaints.Complaint_ID).label("Total Complaints"), (func.count(Complaints.Complaint_ID)*10000/int(State_data.state_population)).label("Complaints per 10,000 People")).\
        innerjoin(Complaints, State_data, Complaints.abbr == State_data.abbr).\
            group_by(Complaints.abbr).all()

    # create lists for results in subquery - ** below code still in progress **
    state = [sub[0] for sub in subq]
    product = [sub[1] for sub in subq]
    count = [int(sub[2]) for sub in subq]

    data = {
        "State": state,
        "Product": product,
        "Count": count
    }

    # generate dictionary
    complaint_dict = [{
        # "State": state,
        # "Population": pop,
        # "Avg. Credit Score": avg_score,
        # "Complaint Count": count,
        # "Count by Type": prod_count
    }]

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)