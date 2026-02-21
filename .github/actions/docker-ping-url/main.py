import os
import requests
from time import sleep
def ping_url(url,delay,max_trials):
    for trials in range(max_trials):
        response = requests.get(url)
        if response.status_code == 200:
            print("URL is reachable")
            return True
        else:
            sleep(delay)
        if trials == (max_trials - 1):
            print("URL is not reachable after {} attempts".format(max_trials))
            return False
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
        if ping_url_return_val == False:
            raise Exception("URL is not reachable after {} attempts".format(input_max_trials))
    else:
        raise Exception("URL, delay and max_trials inputs are required")


if __name__ == "__main__":
    print("Hello world")
    run()

