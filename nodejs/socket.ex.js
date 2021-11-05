// socket_chat.js(BE)

let express = require( "express" );
let app = express();
let http = require( "http" ).Server( app );
let io = require( "socket.io" )( http );

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.get("/chat", (req, res) => {
  res.render('chat_ex')
})


// 현재시간 설정 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var timeZone = moment().format('HH:mm:ss')

// 채팅 참가자 리스트 관리 => {소켓아이디 : 닉네임} 구조
let nick_array = [];
function update_list() {
  let nicks = [];
  for (let socket in nick_array) {
    nicks.push(nick_array[socket]);
  }
  io.emit("update_nicks", nicks);
  console.log(nick_array);
}

io.on("connection", function(socket){
  //최초 입장했을 때
  console.log("Server Socket Connected", socket.id);
  // 채팅 참가자 리스트(배열) 추가
  nick_array[socket.id] = socket.id;
  io.emit("notice", '${socket.id.slice(0,5)}*****(socket.id)님이 입장하셨습니다.');
  update_list();

  // 채팅 메시지를 받았을 때
  socket.on("sendMsg", (msg) => {
    // (1) 클라이언트의 닉네임의 변화 체크 + 닉네임 리스트 업데이트
    if (nick_array[socket.id] !== msg["myNick"]) {
      if (Object.values(nick_array).indexOf(msg["mynick"])> -1) {
        socket.emit("error", "이미 존재하는 대화명 입니다.");
        return false;
      } else {
        nick_array[socket.id] = msg["myNick"];
        update_list();
      }
    }
    const msgTime = timeZone();
    // (2) 귓속말 여부 체크
    if (msg["DM"] !== "전체") {
      let DM_socketID = Object.keys(nick_array).find(key => nick_array[key] === msg["DM"]);
      const data = {msg, msgTime, DM:"(귓말)"};
      io.to(DM_socketID).emit("newMsg", data)
      socket.emit("newMsg", data)
    } else {
      const data = {msg, msgTime};
      io.emit("newMsg", data);
    }
  });
  // 접속자의 퇴장 시
  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
    io.emit("notice", '${nick_array[socket.id]}님이 퇴장하셨습니다.')
    delete nick_array[socket.id];
    update_list();
  })
})


// io.on( "connection", function ( socket ){        
//   socket.on( "sendMsg", ( msg ) =>{       
// 	io.emit( "newMsg", msg );    
// } );

// socket.on( "disconnect", function () {        
// 	io.emit( "newMsg", socket.id + "님이 퇴장했습니다.!" );    
// 		});
// 	} 
// );

http.listen( 8321, ()=>{    
	console.log( "listening on *:8321" );
});