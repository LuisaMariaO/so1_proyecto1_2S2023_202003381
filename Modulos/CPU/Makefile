obj-m += cpu_202003381.o #Nombre del módulo indicado en el enunciado: cpu_<<carnet>>


all:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
	make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean