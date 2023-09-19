const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();




// Para manejar json
app.use(bodyParser.json());

// Para permitir consultas de cualquier origen
app.use(cors());


app.use(morgan('combined'));

const requestIp = require('request-ip');

// Middleware para obtener la dirección IP del cliente
app.use(requestIp.mw());

//Variable para manejar la coneción mysql
var mysql = require('mysql2');

// Raiz
app.get('/', (req, res) => {
  res.send("Hola mundo :D");
});

//Recibiendo ifo del agente golanf
app.post('/post_info', (req, res) => {
  let data = req.body.info;
  var body = JSON.parse(data)
  console.log(body.CPU)
  const clientIP = req.clientIp.replace('::ffff:', '')
  console.log(clientIP)

  res.send("Data recibida!")
});

const connection = mysql.createConnection({ 
host: 'localhost', // host for connection 
//port: 3306, // default port for mysql is 3306 
user: 'root', // username of the mysql connection 
password: 'secret', // password of the mysql connection
database: 'proyecto1', // database from which we want to connect out node application 


});



// Sirviendo en el puerto 8080
app.listen(8080, () => {
  console.log('listening on port 8080');
  //Intentando conectar con la base de datos
  connection.connect(function (err) {
    if(err){
        console.log("error occurred while connecting: "+err.message);
    }
    else{
        console.log("connection created with Mysql successfully");
    }
  });
});