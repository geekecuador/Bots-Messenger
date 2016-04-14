
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var request = require('request');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === '123') {
        res.send(req.query['hub.challenge']);
        console.log("Hola David");
    }
    else
    {
        res.send('Error, wrong validation token');
    }

});

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            if (text === 'Generic') {
                sendGenericMessage(sender);
                continue;
            }
            sendTextMessage(sender, "Tu mensaje fue: "+ text.substring(0, 200));
        }
    }
    res.sendStatus(200);
});

var token= "EAAYJSOuBgdYBABeMV0iIwKJwUXcR3eWY9Pzzaw2ME6xYBPVNnZAR1aZAvFPZAyDwS3DtDAPMyxbYIJ5Sru6pWZBSQwIS8QwG9vWZB0ZCYIBQehqGbADzBIVLEM0YCbICN8zj6ZAE8CjL7bWIdyxX2UllVrRvvu18HXrZB9zej4OYBwZDZD";
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Atractivo 1",
                    "subtitle": "Volcan Cotopaxi",
                    "image_url": "http://www.gestionderiesgos.gob.ec/wp-content/uploads/2015/06/Volcán-Cotopaxi.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com/",
                        "title": "Visitar"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                },{
                    "title": "Atractivo 2",
                    "subtitle": "Laguna Quilotoa",
                    "image_url": "http://www.turismo.gob.ec/wp-content/uploads/2014/02/Quilotoa.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Visitar",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

