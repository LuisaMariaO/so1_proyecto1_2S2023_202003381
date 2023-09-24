package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"net/http"
	"os/exec"
	"time"
)

type Data struct {
	Info string `json:"info"`
}

type Kill struct {
	IP  string `json:"ip"`
	PID string `json:"pid"`
}

type Msg struct {
	Msg string `json:"msg"`
}

func main() {
	//Servidor web
	http.HandleFunc("/kill", func(w http.ResponseWriter, r *http.Request) {
		// Configura los encabezados CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			// Respuesta prefligth para las solicitudes OPTIONS
			return
		}

		fmt.Println(("?"))
		w.Header().Add("content-type", "application/json")
		var kill Kill
		json.NewDecoder((r.Body)).Decode(&kill)

		cmd := exec.Command("sh", "-c", "kill -9 "+kill.PID)
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
		}
		output := string(out[:])
		var msg Msg
		msg.Msg = output
		json.NewEncoder(w).Encode(msg)

	})

	go func() {
		fmt.Println("Servidor web iniciado en http://localhost:5002")
		http.ListenAndServe(":5002", nil)
	}()

	// Configura el cliente que hace solicitudes cada 10 segundos
	go func() {
		for {
			cmd := exec.Command("sh", "-c", "cat /proc/ram_202003381 /proc/cpu_202003381")
			out, err := cmd.CombinedOutput()
			if err != nil {
				fmt.Println(err)
			}
			output := string(out[:])

			var body Data
			body.Info = output

			jsonData, err := json.Marshal(body)
			if err != nil {
				fmt.Println("Error al convertir el objeto JSON en bytes:", err)
				return
			}
			//json.NewDecoder((request.Body)).Decode(&dat)

			// Realiza una solicitud HTTP como cliente a la API en NodeJS, puerto 8080
			resp, err := http.Post("http://backend:8080/post_info", "application/json", bytes.NewBuffer(jsonData))
			if err != nil {
				fmt.Println("Error al realizar la solicitud HTTP:", err)
			} else {
				defer resp.Body.Close()
				fmt.Println("Solicitud HTTP exitosa")
			}

			// Espera 30 segundos antes de realizar la siguiente solicitud
			time.Sleep(30 * time.Second)
		}
	}()

	// Mantén la aplicación en ejecución
	select {}

}
