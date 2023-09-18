#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif

static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0x4cf819e6, "module_layout" },
	{ 0x83599202, "seq_read" },
	{ 0xa81d3524, "remove_proc_entry" },
	{ 0xb4e4d6a9, "proc_create" },
	{ 0x92997ed8, "_printk" },
	{ 0xa68165d, "seq_printf" },
	{ 0xb43f9365, "ktime_get" },
	{ 0xe8f001e9, "init_task" },
	{ 0x944375db, "_totalram_pages" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0x801e8735, "single_open" },
	{ 0xbdfb6dbb, "__fentry__" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "EEAD65A01BC4EAA050C70EB");
