
var express = require('express');
var app = express();

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

})

app.post('/webhook/', function (req, res) {
    console.log("CHAT FACEBOOK");
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            // Handle a text message from this sender
            console.log(text);
        }
    }
    res.sendStatus(200);
});

var token= "EAAXZC58eYFoYBANHLrt5Cd51dLZClNuyZBjOT8IVTfM8TgFqQJUpZCTCIv5vRvjnvkVK6U1uuQcuApI7ybDCO3B4TAnJsQx8lJ0ZBSndpMw7Bmm1LbKfHlHhH7ysNcJFCGzunLcjOYkNtZAsychEDBoE6vqIxypXMWWMxifjDalgZDZD";
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