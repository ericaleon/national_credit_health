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
engine = create_engine('sqlite:///../Database/credit_health.db')

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

###########

# Flask Setup & routes
app = Flask(__name__)

@app.route('/')
def home():
    """Render Home Page."""
    return render_template("index.html")

@app.route('/usdata')
def usdata():
    """Return a list of overall U.S. credit card debt data"""


@app.route('/statedata')
def statedata():
    """Return lists of credit and debt data for each state"""
    results = session.query(State_data.abbr,State_data.score,State_data.Vantage_Score,
        State_data.Total_Debt, State_Data.income).all()

    all_states = []
    for abbr, score, vantage, debt, income in results:
        states_dict = {}
        states_dict["State"] = abbr
        states_dict["Credit/Debt Health Score"] = score
        states_dict["Vantage Credit Score"] = vantage
        states_dict["Total Debt"] = debt
        states_dict["Median Household Income"] = income
        all_states.append(states_dict)

    return jsonify(all_states)


@app.route('/complaints')
def complaints():
    """Return consumer financial protection bureau complaint data"""



if __name__ == '__main__':
    app.run(debug=True)