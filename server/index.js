const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const port = 3001;
const ManagementAPIToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9FVTVNRFV3TmtVeU56TXdOVUV4TnpneVJrWXdSVEV4TUVWQ05USkRNME5CT1RKRlJqRTBRUSJ9.eyJpc3MiOiJodHRwczovL2RvdGEyZmF2LmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJiclBwb3N4YWcwNUxrM1lLRTdRT2dvOGcyMWpCNEVtOUBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kb3RhMmZhdi5ldS5hdXRoMC5jb20vYXBpL3YyLyIsImV4cCI6MTUwMDEyOTg3NywiaWF0IjoxNTAwMDQzNDc3LCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiJ9.cr5dpQWRbp7Nb7fSYw__BTcdhm0rOVzkHo_UuoHESQkvFCyD6IqQcNyBtm6dmIqRUbHZ1WWBtVNahoanFVAHh_nHNShfkKND09DNV_M8Ycnhp0g5s2S9pD6aIyWA2hFbfqarKCmOrmQDo8abWzsh6fNwUIregcyS7bs22ILg5LZB-FE4U4tLm0W_dApq5j4PSGAZVmRZ7HdQvXiFmOeEdbo-wpPg8J424pbHBkeqKr9RRlT7-oDXH13YFZqIg7_dbK8GgVa1eZErx_z_aCImkmduDv35-qrkdDdQe9H1OHeM8g0m0xZwhs0sk5rjUkcGSHpe7zCzMwhHDDIp3fjymg';

const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.use(bodyParser.json());

app.get('/user/:userId', (request, response) => {
    const params = request.params;
    const options = {
        method: 'GET',
        uri: `https://dota2fav.eu.auth0.com/api/v2/users/${params.userId}`,
        headers: {
            'Authorization': ManagementAPIToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(data => {
        response.setHeader('Content-Type', 'application/json');
        response.send(data);
    })
        .catch(err => {
            console.log(err)
        });
});

app.get('/heroes', (request, response) => {
    const options = {
        method: 'GET',
        uri : 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=3D7D20701E1BA0C6C66D11A76D95FA58',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/json'
        // },
        // json: true
    };
    rp(options).then(data => {
        response.setHeader('Content-Type', 'application/json');
        response.send(data);
    })
    .catch(err => {
        console.log(err)
    });
});

app.patch('/update-hero', (request, response) => {
    const options = {
        method: 'PATCH',
        uri: `https://dota2fav.eu.auth0.com/api/v2/users/${request.body.userId}`,
        headers: {
            'Authorization': ManagementAPIToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: request.body.data,
        json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(data => {
        response.setHeader('Content-Type', 'application/json');
        response.send(data);
    })
    .catch(err => {
        console.log(err)
    });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});