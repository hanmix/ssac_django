const express = require( 'express' );
const app = express();
const port = 8321;

const http = require( "http" ).Server( app );
const io = require( "socket.io" )( http );

app.set( "view engine", "ejs" );
app.set( "views", __dirname + "/views" );

app.get( "/", ( req, res ) => {
  res.render( "socket" );
});

io.on( "connection", ( socket ) => {
    // 클라이언트가 socket이 
    // 연결되면 이 안에서 작업을 한다.
    console.log( "Socket connected" );
    // 여기서

    socket.on( "a", ( a )=>{
      console.log( a );

      socket.emit( "send", "hi" );
    });

    socket.on( "disconnect", ()=>{
      console.log( "disconnect" );
    });
    // // 보낼 때는 socket.emit
    // socket.on( "event", ( data ) => {
    //     console.log( data );
    // });

    // socket.on( "event1", ( data ) => {
    //     console.log( data );
    // });

    // socket.on( "event2", ( data ) => {
    //     console.log( data );
    // });

    // socket.on( "event3", ( data ) => {
    //     console.log( data );
    // });

    // socket.on( "event4", ( data ) => {
    //     console.log( data );
    // });
    // socket과 관련한 통신 작업을 모두 처리
});

http.listen( port, () => {
    console.log( "8321!" );
});
