CREATE TABLE usuarios (
	id integer PRIMARY KEY AUTOINCREMENT,
	nome varchar,
	endereco varchar,
	numero integer,
	email varchar,
	login varchar,
	senha varchar,
	data_acesso datetime,
	data_criacao datetime,
	trocar_senha datetime,
	numero_telefone integer,
	numero_fixo integer,
	estado varchar,
	data_bloqueio datetime,
	logado_sistema numeric
);

CREATE TABLE dados_Ia (
	id integer PRIMARY KEY AUTOINCREMENT,
	dados_IA float,
	id_usuarios float
);

CREATE TABLE produtos (
	id integer PRIMARY KEY AUTOINCREMENT,
	nome varchar,
	tipo varchar,
	estado varchar,
	preco float,
	id_usuarios integer,
	imagem blob
);

CREATE TABLE dados_Log (
	id integer PRIMARY KEY AUTOINCREMENT,
	dados_acesso datetime,
	id_usuarios integer
);





