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
engine = create_engine('sqlite:///credit_health.db?check_same_thread=False')

# *Another possible flask sqlite option? - not vetted yet*
# class Config(object):
SQLALCHEMY_DATABASE_URI = 'sqlite:///../Database/credit_health.db?check_same_thread=False'

db = SQLAlchemy()

# def create_app():
#     app.config.from_object(Config)
#     app = Flask(__name__)
#     db.init_app(app)


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
    # results = session.query(Complaints.Product, func.count(Complaints.Product)).\
    #     outerjoin(State_lookup.abbr, Complaints.abbr == State_lookup.abbr).\
    #     group_by(Complaints.abbr).limit(15)
    subq = session.query(Complaints.Product, func.count(Complaints.Product)).group_by(Complaints.Product).all()
   
    # create lists for results in subquery
    product = [sub[0] for sub in subq]
    count = [int(sub[1]) for sub in subq]


    # generate dictionary
    dict = {
        "Product Type": product,
        "Complaint Count": count
    }

    return jsonify(dict)

if __name__ == '__main__':
    app.run(debug=True)