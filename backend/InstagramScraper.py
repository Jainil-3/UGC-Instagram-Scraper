import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import requests

class InstagramScraper:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.profile_dictionary = dict()

    def setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--disable-gpu')  # Disable GPU acceleration
        chrome_options.add_argument('headless')  # Run in headless mode if needed
        driver = webdriver.Chrome(options=chrome_options)
        driver.delete_all_cookies()
        return driver

    def login_instagram(self, driver):
        driver.get('https://www.instagram.com/accounts/login/')
        time.sleep(1.4)
        username_input = driver.find_element(By.NAME, 'username')
        password_input = driver.find_element(By.NAME, 'password')
        username_input.send_keys(self.username)
        time.sleep(1.1)
        password_input.send_keys(self.password)
        time.sleep(.7)
        password_input.send_keys(Keys.RETURN)
        time.sleep(4)

    def scrape_instagram_profile(self, driver, url):
        driver.get(url)
        time.sleep(1.512991)

        try:
            profile_name = driver.find_element(By.XPATH, '//header//a[contains(@href, "/")]')
            url = profile_name.get_attribute('href')
            print(f"Navigating from post to profile: {url}")
            driver.get(url)
        except Exception as e:
            print("Already on profile page")

        time.sleep(1.5)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Extract bio
        bio_text = 'No bio available'
        bio = soup.find('span', class_='x1lliihq')
        if bio:
            bio_text = bio.get_text()

        # Extract follower count
        followers = None
        try:
            followers = soup.find('ul').find_all('li')[1].find('span').get('title')
        except (AttributeError, IndexError):
            followers = 'Unknown'

        # Extract username
        username = url.split("/")[-2]
        profile_data = {'username': username, 'bio': bio_text, 'followers': followers}

        # Add scraped data to profile dictionary
        self.profile_dictionary[username] = profile_data


class GoogleCSEClient:
    def __init__(self, api_key, cse_id):
        self.api_key = api_key
        self.cse_id = cse_id

    def google_cse_search(self, query, num_results):
        profile_urls = []
        start_index = 1  # Start from the first result
        batch_size =  num_results  # Google CSE allows a max of 10 results per request

        while len(profile_urls) < num_results:
            url = (f'https://www.googleapis.com/customsearch/v1?key={self.api_key}&cx={self.cse_id}'
                   f'&q={query}&num={batch_size}&start={start_index}')

            response = requests.get(url)
            data = response.json()

            # If no more items are returned, break the loop
            if not data.get("items"):
                break

            for item in data.get("items", []):
                link = item.get("link")
                if "instagram.com" in link:
                    profile_urls.append(link)

                # Stop if we have collected enough Instagram URLs
                if len(profile_urls) >= num_results:
                    break

            # Move to the next batch of results
            start_index += batch_size

        return profile_urls[:num_results]  # Ensure exactly 'num_results' URLs


class InstagramScraperManager:
    def __init__(self, api_key, cse_id, username, password):
        self.username = username
        self.password = password
        self.scraper = InstagramScraper(self.username, self.password)
        self.cse_client = GoogleCSEClient(api_key, cse_id)

    def start_scraping(self, search_query, num_results=20):
        # Step 1: Capture the start time
        start_time = time.time()

        # Step 2: Fetch Instagram profile URLs from Google CSE API
        profile_urls = self.cse_client.google_cse_search(search_query, num_results=num_results)
        print("Profile length:", len(profile_urls))

        # Step 3: Create a single WebDriver instance
        driver = self.scraper.setup_driver()

        # Step 4: Log into Instagram
        self.scraper.login_instagram(driver)

        # Step 5: Scrape each Instagram profile one by one
        for url in profile_urls:
            self.scraper.scrape_instagram_profile(driver, url)

        # Step 6: Close the WebDriver instance
        driver.quit()

        # Step 7: Capture the end time
        end_time = time.time()

        # Step 8: Calculate and print the time spent
        time_spent = end_time - start_time
        print(f"Total time spent: {time_spent:.2f} seconds")

        # Return the final scraped data as a dictionary of usernames and their profile data
        return self.scraper.profile_dictionary
