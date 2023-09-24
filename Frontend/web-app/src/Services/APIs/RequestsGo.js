import axios from 'axios'

const instance = axios.create(
    {
       // baseURL: 'http://', //TODO:Cambiar la ip
        timeout: 100000,
        headers:{
            'Content-Type':'application/json'
        }
    }
)
export const kill = async(maquina,pid) => {
    const body = {"ip":maquina,"pid":pid}
    console.log(body)
    const {data} = await instance.post("http://"+maquina+":5002/kill",body)
    console.log(data)
    return data
}
