# import dependencies
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, Column, Integer, Float, String

import json
from json import dumps

import pandas as pd

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

app = Flask(__name__)

CORS(app, support_credentials=True)

# DB Setup
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


# helper function to assign colors for each state based on financial health scores
def colorize(data):
    # set up dictionary and lists for keys and values
    c_dict = {}
    keys = []
    values = []

    # iterate through data and assign values to applicable lists
    for d in data:
        keys.append(d["State"])
        if d["Financial_Score"] > 9:
            values.append("#1A5B00")
        elif d["Financial_Score"] > 8:
            values.append("#2E9506")
        elif d["Financial_Score"] > 7:
            values.append("#4DB027")
        elif d["Financial_Score"] > 6:
            values.append("#67D13E")
        elif d["Financial_Score"] > 5:
            values.append("#7CE155")
        elif d["Financial_Score"] > 4:
            values.append("#9EF37D")
        elif d["Financial_Score"] > 3:
            values.append("#D3FAC4")
        elif d["Financial_Score"] > 2:
            values.append("#E1FED7")
        elif d["Financial_Score"] > 1:
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

    scoreColor = json.dumps((colorize(states_list)), sort_keys=False)
   
    return render_template("index.html", stateDATA = stateDATA, scoreColor = scoreColor)

@app.route('/complaints')
def complaints():
    """Return consumer financial protection bureau complaint data"""

    # query complaints and state data tables
    sel = [
        Complaints.abbr, 
        State_data.Vantage_Score,
        State_data.state_population, 
        func.count(Complaints.Product),
        100000.0*func.count(Complaints.Product)/State_data.state_population
        ]
    query = session.query(*sel).join(State_data, Complaints.abbr == State_data.abbr).\
        filter(Complaints.Product=="Credit reporting").group_by(State_data.abbr).\
        order_by(Complaints.abbr.asc())

    # results = pd.read_sql_query(query.statement, query.session.bind)

    abbr_list = []
    crd_score_list = []
    pop_list = []
    complaints_list = []
    comp_capita_list = []

    for abbr, vantage, population, comp_count, comp_capita in query:
        abbr_list.append(abbr)
        crd_score_list.append(vantage)
        pop_list.append(population)
        complaints_list.append(comp_count)
        comp_capita_list.append(round(comp_capita,3))


    # Format the data to send as json
    data = {
        "state_abbr": abbr_list,
        "credit_score": crd_score_list,
        "state_population": pop_list,
        "credit_rpt_complaints": complaints_list,
        "complaints_percapita": comp_capita_list
    }

    return jsonify(data)

    

@app.route('/about')
def about():
    """Return About page for discussion of project"""
    return render_template("index2.html")

if __name__ == '__main__':
    app.run(debug=True)