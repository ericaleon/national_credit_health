# import dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from json import dumps
import json

from flask import (
    Flask,
    render_template,
    jsonify,
    make_response)

from flask_sqlalchemy import SQLAlchemy
import os
import sys
sys.path.append("Users/Emily/Desktop/national_credit_health/app/templates/static/")
from flask_cors import CORS, cross_origin

# DB Setup
###########
engine = create_engine('sqlite:///credit_health.db?check_same_thread=False')

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

CORS(app, support_credentials=True)

def colorize(data):
    # set up dictionary and lists for keys and values
    c_dict = {}
    keys = []
    values = []

    # iterate through data and assign values to applicable list
    for d in data:
        keys.append(d["State"])
        if (d["Financial_Score"]) == 10:
            values.append("#1A5B00")
        elif d["Financial_Score"] >= 9:
            values.append("#2E9506")
        elif d["Financial_Score"] >= 8:
            values.append("#4DB027")
        elif d["Financial_Score"] >= 7:
            values.append("#67D13E")
        elif d["Financial_Score"] >= 6:
            values.append("#7CE155")
        elif d["Financial_Score"] >= 5:
            values.append("#9EF37D")
        elif d["Financial_Score"] >= 4:
            values.append("#D3FAC4")
        elif d["Financial_Score"] >= 3:
            values.append("#E1FED7")
        elif d["Financial_Score"] >= 2:
            values.append("#F1FEEC")
        else:
            values.append("#fffff")
    
    c_dict = dict(zip(keys, values))

    return c_dict
    



@app.route('/')
def home():
    """Render Home Page."""
    """Return lists of credit and debt data for each state"""
    # with open('static/js/state_data_part.json') as f:
    #     geoJ = json.load(f)
    # stateDATA = json.dumps(geoJ, sort_keys=False)
    # # print(stateDATA)
    # return render_template("index.html", stateDATA = stateDATA)
    results = session.query(State_data.name,State_data.score,State_data.Vantage_Score, State_data.Debt_Income, State_data.Mor_Del, State_data.grade).all()

    all_dict = {}
    states_list = []
    for name, score, vantage, debt_inc, mort_del, grade in results:
        states_dict = {}
        states_dict["State"] = name
        states_dict["Financial_Score"] = score
        states_dict["Credit_Score"] = vantage
        states_dict["Debt_Income"] = debt_inc
        states_dict["Mortg_Delinquency"] = mort_del
        states_dict["Ed_Grade"] = grade
        states_list.append(states_dict)

    all_dict = {"States": states_list}
    stateDATA = json.dumps(all_dict, sort_keys=False)

    score_Color = json.dumps((colorize(states_list)), sort_keys=False)
   
    return render_template("index.html", stateDATA = stateDATA, score_Color = score_Color)
    


@app.route('/statedata')
def statedata():
    """Return lists of credit and debt data for each state"""
    with open('static/js/state_data_part.json') as f:
        geoJ = json.load(f)
    stateDATA = json.dumps(geoJ, sort_keys=False)
    return (stateDATA)
    # results = session.query(State_data.name,State_data.score,State_data.Vantage_Score,
    #     State_data.Debt_Income, State_data.Mor_Del, State_data.grade).all()

    # all_states = []
    # for name, score, vantage, debt_inc, mort_del, grade in results:
    #     states_dict = {}
    #     states_dict["State"] = name
    #     states_dict["Financial_Score"] = score
    #     states_dict["Credit_Score"] = vantage
    #     states_dict["Debt-Income"] = debt_inc
    #     states_dict["Mortg_Delinquency"] = mort_del
    #     states_dict["Ed_Grade"] = grade
    #     all_states.append(states_dict)

    # stateDATA = jsonify(all_states)
    
    # return  stateDATA


# @app.route('/complaints')
# def complaints():
#     """Return consumer financial protection bureau complaint data"""
#     # **mySQL Query for Complaint Counts by Type for each State**
#     # SELECT abbr, Product, COUNT(Complaint_ID)
#     # FROM complaints
#     # GROUP BY abbr, Product
#     # ORDER BY abbr ASC;

#     # **Main mySQL Query**
#     # SELECT complaint_full.abbr, full_state_data.Vantage_Score, COUNT(complaint_full.Complaint_ID) as `Total Complaints`, COUNT(complaint_full.Complaint_ID)*10000/full_state_data.state_population as `complaints per 10,000`, full_state_data.state_population
#     # FROM complaint_full
#     # INNER JOIN full_state_data
#     # ON complaint_full.abbr = full_state_data.abbr
#     # GROUP BY complaint_full.abbr;

#     # sub-query for Complaint count by Product Type
#     subq = session.query(Complaints.abbr, Complaints.Product, func.count(Complaints.Product).\
#         group_by(Complaints.abbr, Complaints.Product).order_by(Complaints.abbr.asc()).all()
    
#     # Main query to capture State abbreviation, Credit Score, Total Complaints, Complaints per 10,000 people
#     query = session.query(Complaints.abbr, State_data.Vantage_Score, Complaints.state_population, func.count(Complaints.Complaint_ID).label("Total Complaints"), (func.count(Complaints.Complaint_ID)*10000/int(State_data.state_population)).label("Complaints per 10,000 People")).\
#         innerjoin(Complaints, State_data, Complaints.abbr == State_data.abbr).\
#             group_by(Complaints.abbr).all()

#     # create lists for results in subquery - ** below code still in progress **
#     state = [sub[0] for sub in subq]
#     product = [sub[1] for sub in subq]
#     count = [int(sub[2]) for sub in subq]

#     data = {
#         "State": state,
#         "Product": product,
#         "Count": count
#     }

#     # generate dictionary
#     complaint_dict = [{
#         # "State": state,
#         # "Population": pop,
#         # "Avg. Credit Score": avg_score,
#         # "Complaint Count": count,
#         # "Count by Type": prod_count
#     }]

#     return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)