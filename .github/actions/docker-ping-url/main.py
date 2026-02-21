def ping_url(url,delay,max_trials):
    for trials in range(max_trials):
            response = requests.get(url)
            if response.status_code == 200:
                print("URL is reachable")
                return True
            else:
                sleep(delay)
        if trials == (max_trials-1):
            print("URL is not reachable after {} attempts".format(max_trials))
            return False

def run():
    input_url = os.getenv("INPUT_URL")
    input_delay = int(os.getenv("INPUT_DELAY"))
    input_max_trials = int(os.getenv("INPUT_MAX_TRIALS"))
    ping_url_return_val = ping_url(input_url,input_delay,input_max_trials)
    if ping_url_return_val == False:
        raise Exception("URL is not reachable after {} attempts".format(input_max_trials))


if __name__ == "__main__":
    print("Hello world")
    run()

