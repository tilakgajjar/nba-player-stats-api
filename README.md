# NBA Player API

*API to fetch NBA player information and statistics from https://probasketballapi.com/. 

Create an account on https://probasketballapi.com and use the generated key in server.js file as well as https://github.com/tilakz/nba-player-stats-plotly application. 

## Getting Started

### Prerequisites

Download Node.js from https://nodejs.org/en/download/

install Node.js

### Installing

```
clone the repository
cd repository-name
npm install
npm start
```

### API Documentation

To make calls to the nba-player-stats API, you must make a GET request to the specified URL. In this request you must pass along your API key and arguments. You now have access to the API! All responses will be in the JSON format.

*NBA Players 

http://localhost:5000/player

The Player resource will return limited information about the players, this is primarily used to get the internal player ID and Name. 

Players with any characters other than those from the alphabet are not included. For example, J.J. Hickson is simply JJ Hickson, and Michael Kidd-Gilchrist is Michael KiddGilchrist. Without first and last name all the players information will be returned. 

Arguments:

first_name:	optional
String. The first name of the NBA player.

last_name:	optional
String. The last name of the NBA player.

Examples: 

http://localhost:5000/player?api_key=T8bcils9hULxNAY0eK3n4HuJ7dkQy6Zf&first_name=&last_name=


http://localhost:5000/player?api_key=T8bcils9hULxNAY0eK3n4HuJ7dkQy6Zf&first_name=Kevin&last_name=Durant


*NBA Players Statistics

http://localhost:5000/boxscore

The NBA player boxscore resource includes all of the typical box score statistics you would find anywhere.

Arguments:

player_id:	required
Integer. The ID for the player. Player IDs can be found from the player resource. 

year:	required
String. The season that the game was played in. Must be in YYYY format. If a game was played in 2015, but the season started in 2014 it will be listed under the 2014 season.

http://localhost:5000/boxscore?api_key=T8bcils9hULxNAY0eK3n4HuJ7dkQy6Zf&player_id=201142&year=2017


## Built With

* [Node](https://nodejs.org/en/) - JavaScript Runtime Environment
* [NPM](https://www.npmjs.com/) - Node Package Manager
