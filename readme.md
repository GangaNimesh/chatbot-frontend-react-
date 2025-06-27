# AI chatbot for Innovature.ai

This project is an AI-powered chatbot built to provide intelligent and instant responses to user queries about Innovature.ai. It utilizes Groq’s meta-llama/llama-4-scout-17b-16e-instruct model via API, combining a Flask (Python) backend with a React frontend.

It serves as an automated support solution that can be embedded into any web interface to assist users without human intervention. This project also demonstrates how to integrate large language models (LLMs) with dynamic web apps.

## Features : 

Natural language understanding and response generation.

Context-aware conversation flow.

Real-time interaction with React frontend.

Modular backend structure with keyword-based context and scraping.


## Backend set up (Flask) :

### Prerequisites :

Python 3.8+

Chrome browser (for Selenium-based scraping)

ChromeDriver (compatible version with installed Chrome)

### Install dependencies :

   'pip install flask flask-cors selenium python-dotenv requests'

### Set Up Environment Variables : 

Create a .env file in the project root:
   GROQ_API_KEY = 'your api key'

### Start the Backend Server :

   'python run.py'
   The server will start at: http://localhost:5000


## Frontend set up (React) :

### Prerequisites :

Node.js (v16 or above)

npm

### Navigate to Frontend Directory :

   'cd frontend'

### Install node modules :

   'npm install'

### Run frontend :

   'npm start'
   The frontend will run at: http://localhost:3000


## Usage :

Once both backend and frontend are running :

Open your browser and go to: http://localhost:3000

Interact with the chatbot UI

Messages are sent to the Flask backend → forwarded to Groq API → response returned and displayed in the UI.

## Tech stack : 

Frontend: React, HTML, CSS, JavaScript

Backend: Flask, Python, Selenium

LLM Provider: Groq API (meta-llama/llama-4-scout-17b-16e-instruct model)

Environment: dotenv




