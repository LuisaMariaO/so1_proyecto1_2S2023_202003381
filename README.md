# so1_proyecto1_2S2023_202003381

Luisa María Ortíz Romero - 202003381 

## Manual Técnico

### Módulos de kernel
Los módulos de kernel que monitorean el estado de la memoria RAM y el CPU fueron programados en C y construidos con Make, fueron probados y desplegaos para los headers _5.15.0-79 generic._  
Para construirlos es necesario tener instalado GCC y Make.
 
Para generar binarios compilados:
 
```
make all
```  

Borrar binarios compilados:
 
```
make clean
```
 
Insertar módulo:

```
sudo insmod <nombre_modulo>.ko
``` 

Borrar módulo:
 
```
sudo rmmod <nombre_modulo>
```
 
>Los módulos se insertan en /proc y desde ahí se pueden consultar.

### Agente Go

El agente Golang está encargado de monitorear cada 10 segundos el estado de los módulos insertados en _/proc_ y enviarlos a la API para su almacenamiento en la base de datos y transmisión a la aplicación web. Además, recibe señales _kill_ para matar procesos, lo que la haace ser una app cliente y servidor al mismo tiempo por medio de _go routines._

*Cliente*: Envía información de los módulos a la API
 
*Servidor*: Escucha en el puerto 5002 las señales de kill enviadas por el Frontend. 

[Imagen del agente Go](https://hub.docker.com/r/luisamariao/agente)

### API
 
La API está construida en nodeJS y escucha en el puerto 8080 la información enviada por el agente para guardarla en la base de datos y responde peticiones de información del Frontend. 
 
El servidor se configura con la librería _express_ y se usan _CORS_ para permitir el tráfico hacia este.

[Imagen de la API NodeJS](https://hub.docker.com/r/luisamariao/backend)


### Base de datos MySQL

La base de datos MySQL está basada en la imagen oficial encontrada en dockerhub, cuenta con una tabla para las ips y otra para las lecturas de monitoreo realizadas para poder realizar los reportes solicitados.
 
Para que la base de datos funcione correctamente, es necesario instalar antes MySql server y realizar una conexión para insertar el DDL que define la base de datos y tablas a utilizar.
 
Instalar MySQL server:
 
```
sudo apt install mysql-server
```

 
Conectando con la base de datos, la cual ya debe estar corriendo en un contenedor:
 
```
mysql - 127.0.0.1 -P <puerto_asignado> -u <usuario_bd> -p
```
 
Luego insertar la contraseña designada para ese usuario.
 
En el espacio que se abre, escribir el DDL y escribir _exit_ para salir de mysql server.
 
[Imagen de MySQL](https://hub.docker.com/_/mysql)
 
### Frontend
 
El Frontend fue desarrollado con el framework _React_, se utiliza la librería _react-chartjs-2_ para elaborar las gráficas y _react-data-table-component_ para la información mostrada en tablas. Las peticiones son realizadas con la librería _axios_ y pueden ser hacia la API para solicitar información para mostrar o hacia el servidor del Agente Go para enviar señales que terminen procesos.
 
[Imagen del Frontend](https://hub.docker.com/r/luisamariao/frontend)
 
### Docker Compose
 
Para levantar las aplicaciones que forman parte del monitoreo se utiliza un docker-compose que posee tres servicios: frontend, backend y base, además de incluir algunas variables de entorno y la definición del volumen que permita que la base de datos sea persistente.
 
### Google Cloud PLattform

Es utilizada para desplegar las aplicaciones que hacen funcionar el proceso, utilizando principalente _Compute Engine_, además de la definición de _Redes VPC_, _Reglas de firewall_ y _Grupos de instancias_.
 
*App de monitoreo:* Se compone de los servicios levantados por el docker compose y que permiten la comunicación de los servicios de frontend, backend y base de datos en una misma instancia de máquina virtual.
 
*Grupo de instancias:* Se compone de las instancias autoescalables que contienen dentro los módulos de kernel y el agente Go, para que cada instancia individual envíe información a la API y reciba señales kill del Frontend.
