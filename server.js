const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(express.static(path.join(__dirname, "./static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));
app.set('view engine', 'ejs');

const server = app.listen(1337);
const io = require('socket.io')(server);

var counter = 1;


io.on('connection', function (socket) {
  socket.on('got_a_new_user', function(data) {
    let message = "<li class = 'connected'>";
    message += `${data.name} has connected.`;
    message += "</li>";
    socket.broadcast.emit('connection', {message: message});
  }); 

  socket.on('new_message', function(data) {
    let message = "<li class = 'message'>";
    message += `<span class="name">${data.name}</span>: ${data.message}`;
    message += "</li>";
    io.emit('display_message', {message: message});
  });
  
  socket.on('disconnect', function(data) {
    let message = "<li class = 'connected'>";
    message += `${data.name} has disconnected.`;
    message += "</li>";
    socket.broadcast.emit('connection', {message: message});
  });

});