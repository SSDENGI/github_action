import os
import requests
from time import sleep
def ping_url(url,delay,max_trials):
    for trials in range(max_trials):
        print(f"Attempt ...............{trials + 1}")
        try:
            response = requests.get(url)
            if response.status_code == 200:
                print("URL is reachable")
                return True
            elif trials == (max_trials - 1):
                print("URL is not reachable after {} attempts".format(max_trials))
                return False
        except Exception as e:
            print("Error while pinging URL: {}".format(e))
            sleep(delay)
    return False

def run():
    input_url = os.getenv("INPUT_URL")
    input_delay = os.getenv("INPUT_DELAY")
    input_max_trials = os.getenv("INPUT_MAX_TRIALS")
    print("Pinging URL: {}".format(input_url))
    print("Delay between trials: {} seconds".format(input_delay))
    print("Maximum number of trials: {}".format(input_max_trials))
    if input_url != None and input_delay != None and input_max_trials != None:
        ping_url_return_val = ping_url(input_url,int(input_delay),int(input_max_trials))
    else:
        print("URL, delay and max_trials inputs are required")
    output_file = open(os.getenv("GITHUB_OUTPUT"), 'a')
    output_file.write(f"url-reachable={ping_url_return_val}\n")
    if ping_url_return_val == True:
        print("URL is reachable.......")
    else: 
        print("URL is not reachable.......")


if __name__ == "__main__":
    print("Hello world")
    run()

