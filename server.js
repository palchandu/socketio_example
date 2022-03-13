var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var numClients = 0;
io.on('connection', function (socket) {

    //send data to client phase 1
    socket.emit('from_server_to_client', { message: 'Information send from server to client.' })
    
    // recieve data from client phase 2
    socket.on('from_client_to_server', function (data) {
        console.log('Got Message:', data.message);
    })

    // Counting connected users
    numClients++;
    io.emit('stats', { numClients: numClients })
    console.log('Connected users ', numClients)
    socket.on('disconnect', function () {
        numClients--;
        io.emit('stats', { numClients: numClients })
        console.log('Connected users ', numClients)
    })
})

const port = 8090;
server.listen(port, () => {
    console.log('Application is running on port '+port)
});