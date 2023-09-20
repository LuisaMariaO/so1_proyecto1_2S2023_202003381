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
		fmt.Println(("?"))
		w.Header().Add("content-type", "application/json")
		var kill Kill
		json.NewDecoder((r.Body)).Decode(&kill)

		cmd := exec.Command("sh", "-c", "kill -9 ", kill.PID)
		out, err := cmd.CombinedOutput()
		if err != nil {
			fmt.Println(err)
		}
		output := string(out[:])
		var msg Msg
		msg.Msg = output
		json.NewEncoder(w).Encode(msg)

	})

	// Inicia el servidor web en el puerto 5000 en una goroutine
	go func() {
		fmt.Println("Servidor web iniciado en http://localhost:5000")
		http.ListenAndServe(":5000", nil)
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
			payloadBuf := new(bytes.Buffer)
			json.NewEncoder(payloadBuf).Encode(body)
			// Realiza una solicitud HTTP como cliente a la API en NodeJS, puerto 8080
			resp, err := http.Post("http://localhost:8080/post_info", "application/json", bytes.NewBuffer(jsonData))
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
