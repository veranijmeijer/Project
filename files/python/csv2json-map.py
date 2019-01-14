# Name: Vera Nijmeijer
# Student ID: 10753567

import csv
import json

def create_json(infile, outfile):
    # function loads data from csv (or txt) file to json file

    with open(infile) as input:
        # saves first row as fieldnames
        names = input.readline().strip().split(',')
        fieldnames = []
        dict_dates = {}

        # # removes "" from fieldnames
        for name in names:
            fieldnames.append(name[1:-1])

        # extracts information from csv file into dictionary
        dates = csv.DictReader(input, fieldnames=fieldnames)

        for date in dates:
            if date["Regiokenmerken"][0:2] == "GM" and date["Leeftijd"] == "20150":
                date_info = {}

                fieldnames = ["Inwoners_1", "Bijstandsontvangers_2", "Bijstandsdichtheid_3"]
                names = ["Inwoners", "Bijstandsontvangers", "Bijstandsdichtheid"]

                # makes dictionary with the information about this date
                for fieldname in fieldnames:
                    info = date[fieldname].strip()
                    if info == ".":
                        info = 0.0
                    else:
                        info = float(info)
                    date_info[names[fieldnames.index(fieldname)]] = info

                dict_dates[date["Regiokenmerken"][0:6]] = date_info

        # create JSON file
        with open(outfile, "w") as output:
            json.dump(dict_dates, output, indent=4)

create_json("../data/csv/gemeente_2017.csv", "../data/json/gemeente_2017.json")
create_json("../data/csv/gemeente_2016.csv", "../data/json/gemeente_2016.json")
create_json("../data/csv/gemeente_2015.csv", "../data/json/gemeente_2015.json")
