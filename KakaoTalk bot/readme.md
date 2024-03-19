# KakaoTalk Chatbot Skill Server

## Overview

This project is a Node.js server designed to handle requests from a KakaoTalk chatbot. It features several endpoints to serve different functionalities, such as providing building information, updating and showing recent notices by web scraping, and dynamically responding to user inputs. It's built using the Express framework and includes web scraping with Cheerio for fetching updates from a specified URL.

## Features

- **Express Server**: Utilizes Express for handling HTTP requests efficiently.
- **Building Information**: Responds with information about buildings when queried by users.
- **Notice Update and Display**: Automatically updates and displays the latest notices by scraping web content.
- **KakaoTalk Chatbot**: Designed to work seamlessly with KakaoTalk chatbot API, providing users with quick and interactive responses.

## How It Works

The server is designed to interact with a KakaoTalk chatbot, providing users with various information and services. Here's a breakdown of its core functionalities:

### Handling Requests

The server listens on port 3000 and awaits incoming HTTP POST requests on specific endpoints. Each endpoint corresponds to a different feature or service the chatbot offers:

- **/FindBuilding**: Searches for building information based on user input. If the building is found in the predefined list, it returns details like name, image, geographical coordinates, and a description.
- **/UpdateNotice**: Initiates a web scraping function to update the latest notices from a specified URL. This feature is designed to fetch and store notice information periodically or upon request.
- **/ShowNotice**: Responds with the most recent notice information, formatted for display in the KakaoTalk chat window.
- **/ShowNoticeAll**: Similar to '/ShowNotice', but returns a list of multiple notices.

### Web Scraping for Notices

The 'getNews' function is notice update feature. It uses the 'request' package to fetch the HTML content of a specified URL and then parses this content with 'cheerio' to extract notice details. The function is designed to decode the text properly using 'iconv-lite' to avoid character encoding issues.

Notices are selected based on specific HTML element selectors, making it crucial to tailor the selectors to the structure of the target website. Extracted notices are stored in an array, ready to be served through the chatbot.

### KakaoTalk Chatbot API

The server uses JSON templates compatible with KakaoTalk's chatbot API for its responses. Depending on the endpoint hit by the request, the server constructs a JSON object

The chatbot on KakaoTalk sends user input to the server, which processes this input and returns a formatted response. The chatbot then displays this response to the user in the chat window.

## Dependencies

- **express**: For setting up the server and handling routes.
- **morgan**: For HTTP request logging.
- **body-parser**: For parsing incoming request bodies.
- **request**: For making HTTP requests to other servers.
- **cheerio**: For web scraping and parsing HTML.
- **iconv-lite**: For decoding binary data into text.
- **kakao-platform**: For using the chatbot function of Kakao Talk platform `https://business.kakao.com/`, `https://chatbot.kakao.com/`
