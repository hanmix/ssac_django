// http://13.209.6.70:8321/chat 접속 경로
// ssh aws-server 서버 실행 명령어

// 모듈
let express = require( "express" );
let app = express();
let http = require( "http" ).Server( app );
let io = require( "socket.io" )( http );
const path = require('path');
const multer = require('multer');

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// 현재시간 설정
function getTime() {
  const now = new Date();
  const hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  const minutes = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const seconds = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  return `${hours}:${minutes}:${seconds}`
}

var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var msgTime = moment().format('HH:mm:ss')
console.log("현재 시간은 " + msgTime + " 입니다.")

var storage = multer.diskStorage ( {
  destination : (req, file, cb) => {
    cb(null, "uploads");
  },
  filename : (req, file, cb) => {
    // path라는 모듈을 사용해서 이 파일의 확장자를 가져올 수 있다.
    // extname 이라는 함수를 사용하면 .확장자가 나온다. (확장자만 추출)
    // basename : 이름 추출
    var extname = path.extname(file.originalname);
    console.log(file);
    cb(null, Date.now() + extname);
  }
});

var upload_multer = multer({storage : storage});

app.get("/chat", (req, res) => {
  res.render('chat')
});

app.post("/chat", upload_multer.single("userfile"), (req, res) => {
    console.log(req.file);
    res.send('<script>alert("업로드 완료")</script>')
  });

io.sockets.on('connection', (socket) => {
  
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', (name) => {
    console.log(name + ' 님이 접속하였습니다.' + ' ('+ msgTime + ')')
    console.log(socket.id);

    /* 소켓에 이름 저장해두기 */
    socket.name = name
    
    /* 모든 소켓에게 전송 */
    io.sockets.emit('update', {type: 'connect', name: 'Notice', message: name + '님이 입장하였습니다.', time: msgTime})
  })

  /* 전송한 메시지 받기 */
  socket.on('message', (data) => {
    /* 받은 데이터에 누가 언제 보냈는지 이름과 시간을 추가 */
    data.name = socket.name
    data.time = msgTime

    /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', data);
    console.log(data)
  })

  /* 접속 종료 */
  socket.on('disconnect', () => {
    console.log(socket.name + '님이 퇴장하였습니다.' + ' ('+ msgTime + ')')

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    socket.broadcast.emit('update', {type: 'disconnect', name: 'Notice', message: socket.name + '님이 퇴장하였습니다.', time: msgTime});
  })
})

/* 서버를 8321 포트로 listen */
http.listen(8321, () => {
  console.log('서버 실행 중..')
})