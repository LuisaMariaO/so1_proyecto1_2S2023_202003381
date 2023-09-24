import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import icon from '../docker-icon.png'
import Service  from "../Services/Service";
import {Chart, ArcElement} from 'chart.js'
import {Pie} from 'react-chartjs-2'
import DataTable from 'react-data-table-component'
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

function Index() {
  const [maquina,setMaquina] = useState("0")
  const [maquinas,setMaquinas] = useState([])
  const [cpu, setCPU] = useState(0)
  const [ram, setRAM] = useState(0)
  const [procesos, setProcesos] = useState([])
  const [pid, setPid] = useState("")
  const navigate = useNavigate()

  const handleChangeSelect = (event) => {
    event.preventDefault();
    setMaquina(event.target.value);
    
    Service.getMonitoreo({"ip":event.target.value})
      .then(({ram,cpu,procesos}) => {
          setRAM(ram)
          setCPU(cpu)
          setProcesos(procesos)

    });
  };

  const handleSubmitKill = (event) => {
    event.preventDefault();
    Service.kill(maquina,pid)
      .then(({msg}) => {
          console.log(msg)
          if(msg===""){ 
            alert("¡Proceso eliminado! :D")
            setPid("")
          }else{
            alert("Error: No se encontró el proceso :(")
            setPid("")
          }
         
   
    });
    

  };

  const handleChangePid = (event) =>{
    event.preventDefault();
    setPid(event.target.value)
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
    labels: ["Utilizando","Libre"],
    datasets: [{
      label: "Porcentaje",
      data: [ram,100-ram],
      backgroundColor: [
        '#F84F31',
        '#319BF8 '
      ],
      
    }]
  }

  const optionsRam = {
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
  labels: ["Utilizando", "Libre"],
  datasets: [{
    label: ["Porcentaje"],
    data: [cpu,100-cpu],
    backgroundColor: [
      '#F84F31',
      '#319BF8 '
    ],
    
  }]
}

const optionsCpu = {
  responsive:true,
  mantainAspectRatio:false,
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

//Para las comlumnas de la tabla
  const columns = [
    {
        name: 'PID',
        selector: row => row.pid,
    },
    {
        name: 'Nombre',
        selector: row => row.name,
    },
    {
      name: 'Usuario',
      selector: row => row.user,
    },
    {
      name: 'Estado',
      selector: row => row.state,
    },
    {
      name: '%RAM',
      selector: row => row.ram,
    }
];
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
          <a class="nav-link active" aria-current="page" href="" onClick={()=>navigate("/")}>Tiempo real</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="" onClick={()=>navigate("/history")}>Historial</a>
        </li>
      </ul>
      <form class="d-flex" onSubmit={handleSubmitKill}>
        <input class="form-control me-2" type="search" placeholder="PID" aria-label="Search" onChange={handleChangePid} value={pid}/>
        <button class="btn btn-outline-danger" type="submit" >Kill</button>
      </form>
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
          
          <Pie options={optionsRam} data = {dataRam}/>
          </div>
        

        <div class="col">
    
          <Pie options={optionsCpu} data = {dataCpu}/>
          
          

        </div>

      </div>

      <div class="row">
        <div class="col">
          <DataTable columns={columns} data={procesos}></DataTable>
        </div>
      </div>
      </div> 
    </>
  );
}

export default Index;
