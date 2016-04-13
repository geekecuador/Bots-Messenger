
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
    }
    res.send('Error, wrong validation token');
})
