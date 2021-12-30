// 미들웨어 설정
const express = require('express');
const app = express();
const port = 8321;
const mysql = require('mysql');
const body = require( 'body-parser' );
// session 불러오기
const session = require( 'express-session' );
// cookie 불러오기
const cookie = require( 'cookie-parser' );

const conn = mysql.createConnection({
	host: 'aws-hansm-db.cwc3rsqsjzbq.ap-northeast-2.rds.amazonaws.com',
  user: 'admin',
	password: 'rootadmin',
	database: 'ssac_data'
});

// 뷰엔진 설정
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//static 파일을 불러옴
app.use('/static', express.static(__dirname + '/static'));

// session 사용 옵션들
app.use( session({
	secret: 'greenflower', // 필수항목 으로 cookie-parser의 비밀 키와 같은 역할을 한다.
	resave: false, // 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지에 대한 설정
	saveUninitialized: true // 세션에 저장할 내역이 없더라도 세션을 저장할지 대한 설정
}));

app.use( cookie() );

// body-parser 정제 값 받아오기
app.use( body.urlencoded( { extended:false } ) );
app.use( body.json() );

// 현재시간 설정 모듈
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var timeZone = moment().format('YYYY-MM-DD HH:mm:ss')
console.log("현재 시간은 : " + timeZone + " 입니다.");

// 메인 페이지
app.get('/home', (req, res) => {
  console.log('메인페이지 접속')
  res.render('base');
});

app.post('/home', (req, res) => {
  console.log('메인페이지 접속')
  res.render('base')
})

// 회원가입 페이지
app.get('/signup', (req, res) => {
  console.log('회원가입페이지 접속')
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const userid = req.body.id;
  const password = req.body.pw;
  const useremail = req.body.email;
  const address = req.body.address;
  const addressDetail = req.body.address_detail;
  console.log(req.body);
  const sql = 'INSERT INTO users (userid, password, useremail, address, addressDetail) value (?,?,?,?,?)';
  const params = [userid, password, useremail, address, addressDetail];
  conn.query('select * from users where id=?', [userid], (err, data) => {
    if(data.length == 0) {
      console.log('회원가입 성공');
      conn.query(sql, params, (err, rows) => {
        console.log(rows.insertId);
        res.redirect('/login');
    }
  )}
  
  });
  
});

// 로그인 페이지
app.get('/login', (req, res) => {
  console.log('로그인페이지 접속')
  res.render('login')
});

app.post('/login', (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  conn.query('select * from users where userid=?', [id], (err, data) => {
    if(id == data[0].id && pw == data[0].pw) {
      console.log('로그인 성공');
      res.send("<script>alert('로그인 되었습니다!'</script>")
      res.redirect('/home')
    }
    else {
      console.log('로그인 실패');
      res.redirect('/login')
    };
  });
});

app.listen(port, () => {
  conn.connect((err) => {
    if(err) console.log(err);
    else console.log('DB connected successfully!')
  })
  console.log(conn.state)
  console.log("server connecting!")
});