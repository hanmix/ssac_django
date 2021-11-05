let express = require( "express" );
let app = express();
let http = require( "http" ).Server( app );
let io = require( "socket.io" )( http );

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// 현재시간 설정 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var timeZone = moment().format('HH:mm:ss')
console.log("현재 시간은 " + timeZone + " 입니다.")

app.get("/chat", (req, res) => {
  res.render('chat')
})

io.sockets.on('connection', (socket) => {

  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', (name) => {
    console.log(name + ' 님이 접속하였습니다.' + ' ('+ timeZone + ')')
    console.log(socket.id);

    /* 소켓에 이름 저장해두기 */
    socket.name = name
    
    

    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'Notice', message: name + '님이 입장하였습니다.', time: timeZone})
  })

  /* 전송한 메시지 받기 */
  socket.on('message', (data) => {
    /* 받은 데이터에 누가 언제 보냈는지 이름과 시간을 추가 */
    data.name = socket.name
    data.time = timeZone

    /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', data);
    console.log(data)
  })

  /* 접속 종료 */
  socket.on('disconnect', () => {
    console.log(socket.name + '님이 퇴장하였습니다.' + ' ('+ timeZone + ')')

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', {type: 'disconnect', name: 'Notice', message: socket.name + '님이 퇴장하였습니다.', time: timeZone});
  })
})

/* 서버를 8321 포트로 listen */
http.listen(8321, () => {
  console.log('서버 실행 중..')
})