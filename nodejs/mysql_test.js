var express = require('express');
var app = express();
var mysql = require( 'mysql' );

var conn = mysql.createConnection({
	user: 'root',
	password: 'hunter8484!',
	database: 'nodeDB'
});

app.listen( 8321, function () {
  conn.connect((err) => {
    if(err) console.log(err);
    else console.log('DB connected successfully!')
  })
  console.log(conn.state)

  // var sql = "INSERT INTO member VALUES('tom', '톰', '2021-10-21' );"
  
  // conn.query(sql, function(err) {
  //       if( err ){
  //     console.log( 'failed!! : ' + err );
  //   }
  //   else {
  //     console.log( "data inserted!" );
  //   }
  // });
  var sql = "SELECT * FROM 테이블명 WHERE 컬럼1 = 값;"

  conn.query(sql, function(err, results) {
    for (var  i = 0; i < results.length; i++) {
      console.log(results[i]["ID"]);
    }
  });
});