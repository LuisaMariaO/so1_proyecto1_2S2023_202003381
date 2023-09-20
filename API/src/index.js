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

const connection = mysql.createConnection({ 
  host: 'localhost', // host for connection 
  //port: 3306, // default port for mysql is 3306 
  user: 'root', // username of the mysql connection 
  password: 'secret', // password of the mysql connection
  database: 'proyecto1', // database from which we want to connect out node application 
  
  
  });


  var monitoreo = {}
  var vms = []
// Raiz
app.get('/', (req, res) => {
  //Hago la conexion a la base de datos
  connection.connect(function (err) {
    if(err){
        console.log("error occurred while connecting: "+err.message);
    }
    else{
        console.log("connection created with Mysql successfully");
    }
  });
  res.send("Hola mundo :D");
});

//Recibiendo ifo del agente golang
app.post('/post_info', (req, res) => {
  let data = req.body.info;
  var body = JSON.parse(data)
  //console.log(body.CPU)
  const clientIP = req.clientIp.replace('::ffff:', '')
  //console.log(clientIP)
  let crear = true
  
  //Verifico si ya está insertada la ip en la bd
  var sql = 'SELECT ip FROM vm WHERE ip=\''+clientIP+'\''
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ' + err.message);
    } else {
      if(results.length==0){
        //Guardo en el json de monitoreo
        vms.push({
          "ip":clientIP,
          "ram":body.RAM.Porcentaje_en_uso,
          "cpu":body.CPU.cpu_porcentaje,
          "procesos":body.CPU.processes
        })
        sql = 'INSERT INTO vm (ip) VALUES (\''+clientIP+'\');'
        connection.query(sql, (err, results) => {
          if (err) {
            console.error('Error al ejecutar la consulta: ' + err.message);
          } 
        });
      }else{
        
        let i;
        while(i<vms.length){
          if (vms[i].ip === clientIP){
            crear=false
            vms[i].ram = body.RAM.Porcentaje_en_uso
            vms[i].cpu = body.CPU.cpu_porcentaje,
            vms[i].procesos = body.CPU.processes
            break
          }
          i++
        }
        if(crear){ //En caso de que exista en la bd y no aca porque se interrumpio el servidor
          vms.push({
            "ip":clientIP,
            "ram":body.RAM.Porcentaje_en_uso,
            "cpu":body.CPU.cpu_porcentaje,
            "procesos":body.CPU.processes
          })
        }
      }
      
  const dateObject = new Date();
// current date
// adjust 0 before single digit date
const date = (`0 ${dateObject.getDate()}`).slice(-2);
 
// current month
const month = (`0${dateObject.getMonth() + 1}`).slice(-2);
 
// current year
const year = dateObject.getFullYear();
 
// current hours
const hours = dateObject.getHours();
 
// current minutes
const minutes = dateObject.getMinutes();
 
// current seconds
const seconds = dateObject.getSeconds();

 
// prints date in YYYY-MM-DD format
      const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
 

      sql = 'INSERT INTO lectura (fecha_hora,ram,cpu,vm_ip) VALUES (\''+timestamp+'\','+body.RAM.Porcentaje_en_uso+','+body.CPU.cpu_porcentaje+',\''+clientIP+'\');'
      console.log(sql)
      connection.query(sql, (err, results) => {
        if (err) {
          console.error('Error al ejecutar la consulta: ' + err.message);
        } 
      });
    }
  
    // Cierra la conexión cuando hayas terminado
    //connection.end();
  });
  res.send("Data recibida!")
});


//Obteniendo los valores en tiempo real
app.post('/monitoreo', (req, res) => {

  let ip = req.body.ip

  let respuesta = {}
  let i = 0

  while(i<vms.length){
    if (vms[i].ip === ip){
      respuesta = vms[i]
      break
    }
    i++
  }

  res.send(respuesta)
});

//Obtengo la información de la base de datos
app.get('/get_bd', (req, res) => {
  
  var body = req.body
  
 
  let sql = 'SELECT * FROM lectura WHERE vm_ip=\''+body.ip+'\';'
  console.log(sql)
      connection.query(sql, (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Error en la consulta: '+err });
          console.error('Error al ejecutar la consulta: ' + err.message);
        } else{
         // console.log(results)
          
          res.send(results)
        }
        
      });
 
});


// Sirviendo en el puerto 8080
app.listen(8080, () => {
  console.log('listening on port 8080');
  //Intentando conectar con la base de datos
  
});