#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/proc_fs.h>
#include <asm/uaccess.h>
#include <linux/seq_file.h>
#include <linux/mm.h>



MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Proyecto 1, Modulo de RAM, Laboratorio Sistemas Operativos 1");
MODULE_AUTHOR("Luisa Maria Ortiz");


static int escribir_archivo(struct seq_file *archivo, void *v){
   
    
    struct sysinfo si;
    int total_ram;
    int free_ram;
    int using_ram;
    int using_percent;
    
    // Obtener información del sistema
    si_meminfo(&si);
    
    
    total_ram = si.totalram * (si.mem_unit/1024);
    free_ram = si.freeram * (si.mem_unit/1024);
    using_ram = total_ram-free_ram;
    using_percent = 100*using_ram/total_ram;
    seq_printf(archivo, "{\n\"RAM\":");
    seq_printf(archivo, "{\n\"Total_Ram\":%d,\n", total_ram);
    seq_printf(archivo, "\"Ram_en_Uso\":%d,\n", using_ram);
    seq_printf(archivo, "\"Ram_libre\":%d,\n", free_ram);
    seq_printf(archivo, "\"Porcentaje_en_uso\":%d\n", using_percent);
    seq_printf(archivo, "\"},\n");
    
    return 0;
}

//Funcion que se ejecuta cuando se le hace un cat al modulo.
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

// Porque uso kernel 5.15.0
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

static int _insert(void)
{
    proc_create("ram_202003381", 0, NULL, &operaciones);
    printk(KERN_INFO "Creando modulo RAM\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("ram_202003381", NULL);
    printk(KERN_INFO "Removiendo modulo RAM\n");
}

module_init(_insert);
module_exit(_remove);