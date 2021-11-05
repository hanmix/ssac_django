let express = require( "express" );
let app = express();
const port = 8321;
const path = require('path');

const multer = require('multer');

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

// var upload_multer = multer({
//   dest : "uploads/"
// });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");


app.get("/", (req, res) => {
  res.render('upload')
});

app.post("/upload", upload_multer.single("userfile"), (req, res) => {

// upload_multer.single : 단일 파일 처리
// upload_multer.array : 다중 파일 처리
// upload_multer.field : 여러개의 파일을 처리하지만 잘 안 씀
  console.log(req.file);
  res.send("단일 파일 업로드 Success!");
});

app.post("/upload_multiple", upload_multer.array("userfile"), (req, res) => {

  // upload_multer.single : 단일 파일 처리
  // upload_multer.array : 다중 파일 처리
  // upload_multer.field : 여러개의 파일을 처리하지만 잘 안 씀
    console.log(req.files);
    res.send("다중 파일 업로드 Success!");
  });

app.listen(port, () => {
  console.log("connecting : " + port)
});