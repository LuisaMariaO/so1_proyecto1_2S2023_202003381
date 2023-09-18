CREATE DATABASE proyecto1;
USE proyecto1;

CREATE TABLE lectura (
    fecha_hora TIMESTAMP NOT NULL,
    ram        INTEGER NOT NULL,
    cpu        INTEGER NOT NULL,
    vm_ip      VARCHAR2(30) NOT NULL
);

ALTER TABLE lectura ADD CONSTRAINT lectura_pk PRIMARY KEY ( fecha_hora,
                                                            vm_ip );

CREATE TABLE vm (
    ip VARCHAR2(30) NOT NULL
);

ALTER TABLE vm ADD CONSTRAINT vm_pk PRIMARY KEY ( ip );

ALTER TABLE lectura
    ADD CONSTRAINT lectura_vm_fk FOREIGN KEY ( vm_ip )
        REFERENCES vm ( ip );
