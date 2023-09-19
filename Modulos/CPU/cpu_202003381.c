#include <linux/module.h> // THIS_MODULE, MODULE_VERSION, ...
#include <linux/init.h>   // module_{init,exit}
#include <linux/proc_fs.h>
#include <linux/sched/signal.h> // for_each_process()
#include <linux/seq_file.h>
#include <linux/fs.h>
#include <linux/sched.h>
#include <linux/mm.h> // get_mm_rss()
#include <linux/tick.h>
#include <linux/jiffies.h>
#include <linux/kernel.h>

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Proyecto 1, Modulo de CPU, Laboratorio Sistemas Operativos 1");
MODULE_AUTHOR("Luisa Maria Ortiz");


struct task_struct *task;       // sched.h para tareas/procesos
struct task_struct *task_child; // index de tareas secundarias
struct list_head *list;         // lista de cada tareas




static int escribir_archivo(struct seq_file *file_proc, void *v){
   
    int running = 0;
    int sleeping = 0;
    int zombie = 0;
    int stopped = 0;
    
    unsigned long total_ram_pages;
    unsigned long rss;
  
    

    uint64_t total_cpu_time_ns;
    uint64_t total_usage_ns;
    unsigned long cpu_porcentaje;

    int b;

    int porcentaje;
    int a;
    
    
    
    total_ram_pages = totalram_pages();
    
    if (!total_ram_pages) {
        pr_err("No memory available\n");
        return -EINVAL;
    }
    
    #ifndef CONFIG_MMU
        pr_err("No MMU, cannot calculate RSS.\n");
        return -EINVAL;
    #endif
    
    total_cpu_time_ns = 0; // Inicializa a cero
    total_usage_ns = 0;    // Inicializa a cero
    cpu_porcentaje=0;

    for_each_process(task) {
    uint64_t cpu_time_ns;
    cpu_time_ns = task->utime + task->stime;
    total_usage_ns += cpu_time_ns;
    }

    total_cpu_time_ns = ktime_to_ns(ktime_get());  // Obtén el tiempo total de CPU

    if (total_cpu_time_ns > 0) {
        cpu_porcentaje = (total_usage_ns * 100) / total_cpu_time_ns;
    } else {
        cpu_porcentaje = 0;  // Evitar división por cero
    }

    //---------------------------------------------------------------------------
    
    seq_printf(file_proc, "\"CPU\":{\n\"cpu_total\":%llu,\n", total_cpu_time_ns);
    seq_printf(file_proc, "\n\"cpu_en_uso\":%llu,\n", total_usage_ns);
    seq_printf(file_proc, "\"cpu_porcentaje\":%ld,\n", cpu_porcentaje);
    seq_printf(file_proc, "\"processes\":[\n");
    b = 0;
    // Obtener información del sistema
    

    for_each_process(task)
    {
        
        if (task->mm)
        {
            rss = get_mm_rss(task->mm);
        }
        else
        {
            rss = 0;
        }
        if (b == 0)
        {
            seq_printf(file_proc, "{");
            b = 1;
        }
        else
        {
            seq_printf(file_proc, ",{");
        }
        seq_printf(file_proc, "\"pid\":%d,\n", task->pid);
        seq_printf(file_proc, "\"name\":\"%s\",\n", task->comm);
        seq_printf(file_proc, "\"user\": %u,\n", task->cred->uid.val);
        seq_printf(file_proc, "\"state\":%u,\n", task->__state);
        porcentaje = (rss * 100) / total_ram_pages;
        seq_printf(file_proc, "\"ram\":%d,\n", porcentaje);
        seq_printf(file_proc, "\"child\":[\n");
        a = 0;
        list_for_each(list, &(task->children))
        {
            task_child = list_entry(list, struct task_struct, sibling);
            if (a != 0)
            {
                seq_printf(file_proc, ",{");
                seq_printf(file_proc, "\"pid\":%d,\n", task_child->pid);
                seq_printf(file_proc, "\"name\":\"%s\",\n", task_child->comm);
                seq_printf(file_proc, "\"state\":%u,\n", task_child->__state);
                seq_printf(file_proc, "\"pidPadre\":%d\n", task->pid);
                seq_printf(file_proc, "}\n");
            }
            else
            {
                seq_printf(file_proc, "{");
                seq_printf(file_proc, "\"pid\":%d,\n", task_child->pid);
                seq_printf(file_proc, "\"name\":\"%s\",\n", task_child->comm);
                seq_printf(file_proc, "\"state\":%u,\n", task_child->__state);
                seq_printf(file_proc, "\"pidPadre\":%d\n", task->pid);
                seq_printf(file_proc, "}\n");
                a = 1;
            }
        }
        a = 0;
        seq_printf(file_proc, "\n]");

        if (task->__state == 0)
        {
            running += 1;
        }
        else if (task->__state == 1)
        {
            sleeping += 1;
        }
        else if (task->__state == 4)
        {
            zombie += 1;
        }
        else
        {
            stopped += 1;
        }
        seq_printf(file_proc, "}\n");
    }
    b = 0;
    seq_printf(file_proc, "],\n");
    seq_printf(file_proc, "\"running\":%d,\n", running);
    seq_printf(file_proc, "\"sleeping\":%d,\n", sleeping);
    seq_printf(file_proc, "\"zombie\":%d,\n", zombie);
    seq_printf(file_proc, "\"stopped\":%d,\n", stopped);
    seq_printf(file_proc, "\"total\":%d\n", running + sleeping + zombie + stopped);
    seq_printf(file_proc, "}\n");
    seq_printf(file_proc, "\n}\n");
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
    proc_create("cpu_202003381", 0, NULL, &operaciones);
    printk(KERN_INFO "Creando modulo CPU\n");
    return 0;
}

static void _remove(void)
{
    remove_proc_entry("cpu_202003381", NULL);
    printk(KERN_INFO "Removiendo modulo CPU\n");
}

module_init(_insert);
module_exit(_remove);