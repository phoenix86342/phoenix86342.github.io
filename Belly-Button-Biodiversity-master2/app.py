#Import Dependencies
from flask import Flask, jsonify, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, desc


#Initialize Flask
app = Flask(__name__)

#Initializes databse connection
engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_metadata = Base.classes.samples_metadata

#Creates Session
session = Session(engine)

#Creates the dashboard home route (renders HTML template)
@app.route("/")
def home():
    """Return the dashboard homepage"""
    return render_template("index.html")

#Creates the list of sample names in the format ["BB_940" etc.]
@app.route("/names")
def names():
    """List of sample names.
    Returns a list of sample names in the format
    [
        "BB_940",
        "BB_941",
        "BB_943",
        "BB_944",
        "BB_945",
        "BB_946",
        "BB_947",
        ...
    ]
    """
    samples = Samples.__table__.columns
    samples_list = [sample.key for sample in samples]
    samples_list.remove("otu_id")
    return jsonify(samples_list)

#Returns a list of OTU (Operational Taxonomy Units) descriptions
@app.route("/otu")
def otu():
    """List of OTU descriptions.
    Returns a list of OTU descriptions in the following format
    [
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
        "Bacteria",
        "Bacteria",
        "Bacteria",
        ...
    ]
    """
    otu_descriptions = session.query(Otu.lowest_taxonomic_unit_found).all()
    otu_descriptions_list = [x for (x), in otu_descriptions]
    return jsonify(otu_descriptions_list)

#Returns a json dictionary of sample metadata for a given sample.
@app.route("/metadata/<sample>")
def sample_query(sample):
    sample_name = sample.replace("BB_", "")
    sample_conv =int(sample_name)
    result = session.query(Samples_metadata.AGE, Samples_metadata.BBTYPE, Samples_metadata.ETHNICITY,\
    Samples_metadata.GENDER, Samples_metadata.LOCATION, Samples_metadata.SAMPLEID)\
    .filter_by(SAMPLEID = sample_conv).all()
    sample_result = result[0]
    sample_dict = {
        "AGE": sample_result[0],
        "BBTYPE": sample_result[1],
        "ETHNICITY": sample_result[2],
        "GENDER": sample_result[3],
        "LOCATION": sample_result[4],
        "SAMPLEID": sample_result[5]
    }
    return jsonify(sample_dict)

#Returns the weekly washing frequency as a number.
@app.route("/wfreq/<sample>")
def wfrequency(sample):
    sample_name = sample.replace("BB_", "")
    sample_conv = int(sample_name)
    result = session.query(Samples_metadata.WFREQ).filter_by(SAMPLEID = sample_conv).all()
    wash_freq = result[0][0]
    return jsonify(wash_freq)

#Returns a list of dictionaries of sorted lists containing OTU IDs and Sample Values for a given sample.
#The pandas Dataframe is sorted in Descending Order by Sample Value
@app.route("/samples/<sample>")
def samples(sample):
    sample_query ="Samples." + sample
    result = session.query(Samples.otu_id, sample_query).order_by(desc(sample_query)).all()
    otu_ids = [result[x][0] for x in range(len(result))]
    sample_values = [result[x][1] for x in range(len(result))]
    dict_list = [{"otu_ids": otu_ids}, {"sample_values": sample_values}]
    return jsonify(dict_list)

#This part executes the flask app

if __name__ == '__main__':
    app.run(debug=True)
