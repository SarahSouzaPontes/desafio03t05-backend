create database dindin;
DROP TABLE if exists usuarios;
CREATE TABLE usuarios (
    id serial primary key, 
    nome text not null,
    email text not null unique,
    senha text not null
);

CREATE TABLE categoria (
    id serial primary key, 
	descricao text not null
);
CREATE TABLE transacao (
    id serial primary key, 
    descricao text not null,
    valor int not null,
    data timestamp not null,
    categoria_id serial references categoria (id),
    usuario_id serial references usuarios (id),
    tipo text
);