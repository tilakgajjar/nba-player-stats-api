'use strict';

const Hapi = require('hapi');
const requestGlb = require('request');
var corsHeaders = require('hapi-cors-headers')
const server = new Hapi.Server();
server.connection({ port: +process.env.PORT || 5000, host: 'localhost', routes: { cors: true } })
//server.connection(port: 5000, host: 'localhost', routes: { cors: true } });
const apikey= 'T8bcils9hULxNAY0eK3n4HuJ7dkQy6Zf'
server.ext('onPreResponse', corsHeaders)

server.route({
    config: {
        cors: {
          headers: ['Origin', 'X-Requested-With', 'Content-Type'],
          credentials: true,
          additionalHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin: *, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID'],
          additionalExposedHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID']
        }
    },
    method: 'GET',
    path: '/player',
    handler: function (request, reply) {
      let games = []
      let first_name = request.query.first_name
      let last_name = request.query.last_name
      const api_key = request.query.api_key

      if(api_key!==apikey){
        reply('Invalid API Key')
        return
      }

      if(first_name===undefined) first_name = ''
      if(last_name===undefined) last_name = ''

      requestGlb.post(

              `http://api.probasketballapi.com/player?api_key=${api_key}&last_name=${last_name}&first_name=${first_name}`,
              { json: { key: 'value' } },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      games = body
                      if(games.length===0){
                        reply('Player name did not match with the database')
                      }else {
                          let playerInfo = games.map((game, index, games) => ({id: game.id , first_name: game.first_name, last_name: game.last_name, player_name: game.player_name }))
                          reply(playerInfo,  'access-control-allow-headers')
                        }
                  }
              }
          )
    }
});



server.route({
    config: {
      cors: {
        headers: ['Origin', 'X-Requested-With', 'Content-Type'],
        credentials: true,
        additionalHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID'],
        additionalExposedHeaders: ['access-control-allow-headers', 'Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORRELATION_ID']
      }
    },
    method: 'GET',
    path: '/boxscore',
    handler: function (request, reply) {
      let games = []
      let player_id = request.query.player_id
      let year = request.query.year
      const api_key = request.query.api_key
      let stats = []

      if(api_key!==apikey){
        reply('Invalid API Key')
        return
      }

      if(player_id===undefined || player_id==='') {
        reply('Player ID is required')
        return
      }
      if(year===undefined) year = ''

      requestGlb.post(
              `http://api.probasketballapi.com/boxscore/player?api_key=${api_key}&player_id=${player_id}&season=${year}`,
              { json: { key: 'value' } },
              function (error, response, body) {
                  if (!error && response.statusCode == 200) {
                      games = body
                      if(games.length!==0){
                        const tallyGames = (a, b) =>
                          Object.assign({}, a, b, {
                            pts: a.pts + b.pts,
                            ast: a.ast + b.ast,
                            oreb: a.oreb + b.oreb,
                            dreb: a.dreb + b.dreb,
                            fgm: a.fgm + b.fgm,
                            fga: a.fga + b.fga,
                            fg3m: a.fg3m + b.fg3m,
                            fg3a: a.fg3a + b.fg3a,
                          });

                        const buildStatsObject = results => ({
                          'ppg': results.pts/games.length,
                          'apg': results.ast/games.length,
                          'rpg': (results.oreb + results.dreb)/games.length,
                          'fg%': (results.fgm/results.fga)*100,
                          '3p%': (results.fg3m/results.fg3a)*100

                        });
                        const stat = buildStatsObject(games.reduce(tallyGames));
                        stats = stats.concat(stat)
                        reply(stats)
                      }else {
                        reply('Please select a valid value')
                      }
                  }
              }
          );
        }
});


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

//http://localhost:3000/player?firstname=james&lastname=harden
//http://localhost:3000/boxscore?player_id=201935&year=2017
