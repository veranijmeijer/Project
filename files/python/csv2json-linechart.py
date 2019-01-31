# Name: Vera Nijmeijer
# Student ID: 10753567
# Assignment minor Programmeren UvA

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

            if date["Perioden"][-4:-2] == "JJ":
                total = 0
                date_info = {}

                fieldnames = ["WAOUitkeringen_2", "WajongUitkeringen_3", "WAZUitkeringen_4", "IVAUitkeringen_6", "WGAUitkeringen_7", "NietSeizoengecorrigeerd_8", "IOWUitkeringen_10", "TotaalBijstandsuitkeringen_11", "IOAWUitkeringen_14", "IOAZUitkeringen_15", "AOWUitkeringen_16", "AnwUitkeringen_17", "AKWUitkeringen_18"]
                names = ["WAO", "Wajong", "WAZ", "IVA", "WGA", "Werkloosheidsuitkering", "IOW", "Bijstand", "IOAW", "IOAZ", "AOW", "ANW", "AKW"]

                # makes dictionary with the information about this date
                for fieldname in fieldnames:
                    info = date[fieldname].strip()
                    if info == ".":
                        info = ""
                    elif info != "":
                        info = float(info)
                        total += info
                    # print(fieldnames.index(fieldname))
                    date_info[names[fieldnames.index(fieldname)]] = info

                    if fieldname == "AKWUitkeringen_18":
                        date_info["total"] = total

                dict_dates[date["Perioden"][:-4]] = date_info

        # create JSON file
        with open(outfile, "w") as output:
            json.dump(dict_dates, output, indent=4)

create_json("../data/csv/social_security.csv", "../data/json/social_security.json")
