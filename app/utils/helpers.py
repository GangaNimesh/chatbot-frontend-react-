import json #for reading and writing json files
import time #for adding delays
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

logging.basicConfig(level=logging.INFO)

def scrape_website_selenium(url):
    options = Options()
    options.add_argument("--headless")#browser runs without a visible window
    driver = webdriver.Chrome(options=options)
    try:
        logging.info(f"Scraping website: {url}")
        driver.get(url)
        time.sleep(5)
        text = driver.find_element(By.TAG_NAME, "body").text[:2000]
        logging.info("Website scraping successful.")
        return text
    except Exception as e:
        logging.exception("Error during website scraping.")
        return f"Error scraping website: {e}"
    finally:
        driver.quit()
def load_manual_data():
    try:
        with open("data.json", "r") as file:
            data = json.load(file)
        return data
    except Exception as e:
        logging.exception("Failed to load manual data from data.json.")
        return{}
def load_keyword_instructions():
    try:
        with open("keyword_instructions.json", "r") as file:
            instructions = json.load(file)
        return instructions
    except Exception as e:
        logging.exception("Failed to load keyword_instructions.json.")
        return{} #returns empty dict if error occurs