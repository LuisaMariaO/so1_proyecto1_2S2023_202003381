import axios from 'axios'

const instance = axios.create(
    {
        baseURL: 'http://localhost:8080', //TODO:Cambiar la ip
        timeout: 100000,
        headers:{
            'Content-Type':'application/json'
        }
    }
)

export const getMaquinas = async() =>{
    const { data } = await instance.get("/get_maquinas")
    return data
}

export const getMonitoreo = async(value) => {
    const {data} = await instance.post("/monitoreo",value)
    console.log(value)
    return data
}
export const getBd = async(value) => {
    console.log(value)
    const {data} = await instance.post("/get_bd",value)
    //console.log(data)
    return {"data":data}
}


