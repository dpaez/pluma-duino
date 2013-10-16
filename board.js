var five = require("johnny-five"),
    sio = require("socket.io"),
    board = new five.Board()
    io = sio.listen(8080);

board.on("ready", function() {

  // Create some J5 HW module
  // e.g: var motor = new five.motor()
  // And pass it selected module pins as options
  // Abstract this creation process and exposes it
  // through websockets so new modules can be 
  // attached to board on-the-fly via Pluma app. 

});