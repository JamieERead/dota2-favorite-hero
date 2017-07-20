const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 3001; // process for heroku port assigning

const app = express();
const buildFolder = process.env.NODE_ENV === 'production' ? 'build' : 'public';

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', buildFolder)));

app.use(bodyParser.json());

function getManagementToken() {
    const body = {
        "grant_type": "client_credentials",
        "client_id": "brPposxag05Lk3YKE7QOgo8g21jB4Em9",
        "client_secret": "M5JIh4KI9Nd1K4mQ4lJHXtskNaSH3aFYJn9qRoej_PvgQ3m_GeUVfpJ9EyMShxHm",
        "audience": "https://dota2fav.eu.auth0.com/api/v2/"
    };
    const options = {
        method: 'POST',
        uri: 'https://dota2fav.eu.auth0.com/oauth/token',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body, null, 3)
    };
    return rp(options).then((response) => 'Bearer ' + JSON.parse(response).access_token);
}

app.get('/user/:userId', (request, response) => {
    getManagementToken().then(accessToken => {
        const params = request.params;
        const options = {
            method: 'GET',
            uri: `https://dota2fav.eu.auth0.com/api/v2/users/${params.userId}`,
            headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(options);
    })
    .then(data => {
        response.send(data);
    })
    .catch(err => {
        console.log(err)
    });
});

app.patch('/update-hero/:userId', (request, response) => {
    getManagementToken().then(accessToken => {
        const params = request.params;
        const options = {
            method: 'PATCH',
            uri: `https://dota2fav.eu.auth0.com/api/v2/users/${params.userId}`,
            headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: request.body,
            json: true // Automatically parses the JSON string in the response
        };
        return rp(options);
    })
    .then(data => {
        response.send(data);
    })
    .catch(err => {
        console.log(err)
    });
});

app.get('/heroes', (request, response) => {
    const options = {
        method: 'GET',
        uri: 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=3D7D20701E1BA0C6C66D11A76D95FA58&language=gb',
    };
    rp(options).then(data => {
        response.send(data);
    })
    .catch(err => {
        console.log(err)
    });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', buildFolder, 'index.html'));
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});