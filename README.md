# Getting Started

## Requirements
- Node.js

## Installation
1. Clone this repository
2. cd into the directory
3. Run `npm install`

## Getting Credentials
1. Create new project in [Google Cloud Platform](https://console.cloud.google.com/)
2. Configure OAuth consent screen
3. Create OAuth client ID of type "Desktop app"
4. Download credential as JSON and save it as `client_secret.json` in the root directory of this project
5. Change the `redirect_uri` in `client_secret.json` to `http://localhost:3000/oauth2callback`

## Usage
- Run `npm start`