import json
import os

# Create a dictionary of patients with unique usernames
authentication_data = {
    "john_doe12": {
        "password": "johndoe12",
    },
    "jane_doe34": {
        "password": "janedoe34",
    }
}

# Ensure the 'src' directory exists or create it
if not os.path.exists('src'):
    os.makedirs('src')

# Export the dictionary to a JSON file in the 'src' folder
with open('src/authentication_data.json', 'w') as json_file:
    json.dump(authentication_data, json_file, indent=4)

print("Patient data has been saved to 'src/authentication_data.json'.")


        # "Summary": "Hi, John! Most of your results look great! However, your low WBC is something to investigate. Have you felt sick at all lately? If so, it may be wise to have another panel done once you feel better. Low WBC can be linked to a temporary illness."

