CREATE TABLE usuarios (
    id serial primary key, 
    nome varchar (60) not null,
    email varchar(80) not null unique,
    senha text not null
)
