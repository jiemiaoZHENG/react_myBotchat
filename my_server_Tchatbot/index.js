const express = require('express'); 
const app = express();
const axios = require('axios');
const server = app.listen(3000);
const io = require('socket.io')(server);

var urlYoutube = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBNRehqNg4RN6J17dF5BJiJennYzbJCw_k&type=video&part=snippet&maxResults=5&q=";
var urlWeather = "http://api.weatherstack.com/current?access_key=9e04308741fd8eb8e8b4a6616b8933b8&units=m&query=";
var urlImdb ="http://www.omdbapi.com/?apikey=44f977a3&page=1&s=";

var youtube = "youtube ";
var time = "time";
var meteo ="meteo ";
var imdb ="imdb ";

io.on('connection', (socket) => {   
    io.emit('session_id', socket.id)
    //get message sended and send to other user
    socket.on('message_send', (msg) => {
        console.log(msg);
        io.emit('message_content', { content: msg.content, group: msg.group });
        msgLowerCase = msg.content.toLowerCase();
        if (msg.content.includes(youtube)){
            var name = msgLowerCase.split(youtube)[1];
            searchInYoutube(name);
        }
        if(msg.content.includes(time)){
            var localTime = "Il est " + new Date().toLocaleTimeString('fr-FR');
            io.emit('localtime', {group: "localtime", content: localTime})
        }
        if(msg.content.includes(meteo)){
            var cityName = msgLowerCase.split(meteo)[1];
            searchWeatherByCity(cityName);
        }
        if(msg.content.includes(imdb)){
            var filmName = msgLowerCase.split(imdb)[1];
            searchfilmsByName(filmName);
        }
    });
  
    function searchInYoutube(name) {
        const content = [];
        axios.get(urlYoutube.concat("", name))
        .then(response => {
            for(var i in response.data.items) {
                var item = response.data.items[i];
                var urlAndTitle = {};
                urlAndTitle['url'] = item.id.videoId;
                urlAndTitle['title'] = item.snippet.title;
                content.push(urlAndTitle);
                console.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
            }
            io.emit('youtube_content', { group: "youtube", content: content });
        })
        .catch(error => {
            console.log(error);
        });
    }

    function searchWeatherByCity(cityName){
        const content = [];
        axios.get(urlWeather.concat("", cityName))
        .then(response => {
                var item = response.data;
                var weatherInfo = {};
                weatherInfo['cityName'] = item.location.name;
                weatherInfo['country'] = item.location.country;
                weatherInfo['region'] = item.location.region;
                weatherInfo['localtime'] = item.location.localtime;
                weatherInfo['temperature'] = item.current.temperature;
                weatherInfo['weather_descriptions'] = item.current.weather_descriptions;
                content.push(weatherInfo);
                io.emit('meteo_content', { group: "meteo", content: content });
        })
        .catch(error => {
            io.emit('message_content', { group: "error", content: "Ville introuvable, veuillez saisir la ville en anglais" });
        });
    }

    function searchfilmsByName(name) {
        const content = [];
        axios.get(urlImdb.concat("", name))
        .then(response => {
            var data = response.data.Search;
            //console.log(data);
            for(var i in data) {
                var item = data[i];
                var filmList = {};
                filmList['title'] = item.Title;
                filmList['year'] = item.Year;
                filmList['type'] = item.Type;
                filmList['urlImg'] = item.Poster;
                content.push(filmList);
            }
            console.log(data);
            if(data){
                io.emit('imdb_content', { group: "imdb", content: content });
            }else{
                io.emit('imdb_content', { group: "error", content: "aucun film trouvé" });
            }
        })
        .catch(error => {
            io.emit('imdb_content', { group: "error", content: " aucun film trouvé" });
            console.log(error);
        });
    }
});


