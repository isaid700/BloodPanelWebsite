import json
import os
from datetime import datetime, timedelta
import random

# Generate synthetic CBC blood panel data for two different dates
def generate_cbc_panel():
    return {
        "Red Blood Cells (RBC)": (round(random.uniform(4.2, 5.9), 1), "million cells/mcL"),
        "White Blood Cells (WBC)": (round(random.uniform(4.0, 11.0), 1), "thousand cells/mcL"),
        "Hemoglobin": (round(random.uniform(12.0, 17.5), 1), "g/dL"),
        "Hematocrit": (round(random.uniform(36.0, 52.0), 1), "%"),
        "Platelets": (round(random.uniform(150, 450), 0), "thousand cells/mcL"),
        # "Summary": "Hi, John! Most of your results look great! However, your low WBC is something to investigate. Have you felt sick at all lately? If so, it may be wise to have another panel done once you feel better. Low WBC can be linked to a temporary illness."
    }

# Create a dictionary of patients with unique usernames
patients_data = {
    "john_doe12": {
        "patient_name": "John Doe",
        "CBC_blood_panel_results": {
            (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d"): generate_cbc_panel(),
            (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d"): generate_cbc_panel()
        }
    },
    "jane_doe34": {
        "patient_name": "Jane Doe",
        "CBC_blood_panel_results": {
            (datetime.now() - timedelta(days=15)).strftime("%Y-%m-%d"): generate_cbc_panel(),
            (datetime.now() - timedelta(days=45)).strftime("%Y-%m-%d"): generate_cbc_panel()
        }
    }
}

# Ensure the 'src' directory exists or create it
if not os.path.exists('src'):
    os.makedirs('src')

# Export the dictionary to a JSON file in the 'src' folder
with open('src/patients_data.json', 'w') as json_file:
    json.dump(patients_data, json_file, indent=4)

print("Patient data has been saved to 'src/patient_data.json'.")


        # "Summary": "Hi, John! Most of your results look great! However, your low WBC is something to investigate. Have you felt sick at all lately? If so, it may be wise to have another panel done once you feel better. Low WBC can be linked to a temporary illness."

