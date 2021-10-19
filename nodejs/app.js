const express = require('express');
const app = express();
const port = 8321;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// app.use('/test', express.static('static'));
// app.use('/aaa', express.static(__dirname, '/static')); //가상경로(/aaa)를 설정해서 static 파일을 불러옴

const body = require( 'body-parser' );
app.use( body.urlencoded( { extended:false } ) );
app.use( body.json() );

app.get('/test', (req, res) => {
  res.render('test', {parameter1: 5, parameter2:'하이'});
});

app.get('/form', (req, res) => {
  console.log(req.query.id);
  res.render('form');
});
app.post('/form', (req, res) => {
  console.log(req.body);
  console.log("post form 들어옴");

  res.render('formCheck', {id: req.body.id, email: req.body.email, address: req.body.address + " " + req.body.address_detail});
});


app.get('/', (req, res) => {
  res.send('안녕');
});

app.listen(port, () => {
  console.log("8321!")
});