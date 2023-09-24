import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import icon from '../docker-icon.png'
import Service  from "../Services/Service";
import {Chart, ArcElement} from 'chart.js'
import {Line} from 'react-chartjs-2'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
Chart.register(ArcElement)

function History() {
  const [maquina,setMaquina] = useState("0")
  const [maquinas,setMaquinas] = useState([])
  const [cpu, setCPU] = useState([])
  const [ram, setRAM] = useState([])
  const [fecha, setFecha] = useState([])
  const navigate = useNavigate()

  const handleChangeSelect = (event) => {
    setMaquina(event.target.value);
    
    Service.getBd({"ip":event.target.value})
      .then(({data}) => {
          //console.log(data.map(function(a) {return a.ram}))
          setFecha(data.map(function(a) {return a.fecha_hora}))
          setRAM(data.map(function(b) {return b.ram}))
          setCPU(data.map(function(c) {return c.cpu}))

    });
  };



  //Realizando la petición para obtener máquinas virtuales cada 35 segundos
  useEffect(() => {
    // Definir una función que realiza la petición
    const realizarPeticion = () => {
      Service.getMaquinas()
      .then(({maquinas}) => {
          setMaquinas(maquinas)
   
    });

      // Configurar el próximo timeout para repetir la petición después de 5 segundos
      setTimeout(realizarPeticion, 35000);
    };

    // Iniciar la primera petición
    realizarPeticion();
  }, []);

  const dataRam = {
    labels: fecha,
    datasets: [{
      label: "Porcentaje",
      fill: false,
      data: ram,
      backgroundColor:'#08D245',
      borderColor: '#08C441 '
      
    }]
  }

  const optionsRam = {
    scales: {
      y: {
        beginAtZero:true,
        max:100,
        ticks: {
          stepSize: 10, // Esto no funcionará en react-chartjs-2, pero puedes usar callback
          
        },
          title: {
            display: true,
            text: 'Porcentaje'
          }
      },
      x: {
        title: {
          display: true,
          text: 'Timestamp'
        }
    }
    },
    responsive:true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Memoria RAM',
        font:{size:20}
      }
  }
}

const dataCpu = {
  labels: fecha,
  datasets: [{
    label: ["Porcentaje"],
    data: cpu,
    backgroundColor:'#0E7BEE',
    backgroundColor: '#0F72DA'
    
  }]
}

const optionsCpu = {
  scales: {
    y: {
      title: {
        display: true,
        text: 'Porcentaje'
      },
        beginAtZero:true,
        max:100,
        ticks: {
          stepSize: 10, // Esto no funcionará en react-chartjs-2, pero puedes usar callback
          
        },
    },
    x: {
      title: {
        display: true,
        text: 'Timestamp'
      }
  }
  },
 responsive:true,
  //mantainAspectRatio:false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Utilización de CPU',
      font:{size:20}

    }
}
}


  return (
    <>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <img src={icon} style={{width:"5%"}}></img> &nbsp; &nbsp;
      <a class="navbar-brand" href="">SO1 - Módulos de kernel</a>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="" onClick={()=>navigate("/")}>Tiempo real</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="" onClick={()=>navigate("/history")}>Historial</a>
        </li>
      </ul>
      
    </div>
  </div>
</nav>
    <br></br><br></br>
   <div class="container text-center">
   <div class="row"> 

  <select class="form-select" aria-label="Default select example" onChange={handleChangeSelect}>
  <option selected value="0">Máquina Virtual</option>
  <option value={maquinas[0]}>{maquinas[0]}</option>
  <option value={maquinas[1]}>{maquinas[1]}</option>
  <option value={maquinas[2]}>{maquinas[2]}</option>
  <option value={maquinas[3]}>{maquinas[3]}</option>
</select>

</div>

    </div>

    <div class="container text-center">
      <div class="row justify-content-md-center">
        <div class="col">
          
          <Line options={optionsRam} data = {dataRam}/>
          </div>
        

        <div class="col">
          
         <div>
          <Line options={optionsCpu} data = {dataCpu}/>
          </div>
          

        </div>

      </div>

      
      </div> 
    </>
  );
}

export default History;
