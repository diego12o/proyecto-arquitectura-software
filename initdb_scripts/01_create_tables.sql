CREATE TABLE IF NOT EXISTS curso (
  codigo varchar(50) PRIMARY KEY,
  carrera varchar(50) NOT NULL DEFAULT '0',
  nombre varchar(50) NOT NULL DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS profesor (
  id SERIAL PRIMARY KEY,
  correo varchar(50) NOT NULL,
  nombre varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS profesor_curso (
  id SERIAL PRIMARY KEY,
  codigo_curso int NOT NULL,
  id_profesor int NOT NULL,
  FOREIGN KEY (codigo_curso) REFERENCES curso (codigo),
  FOREIGN KEY (id_profesor) REFERENCES profesor (id)
);

CREATE TABLE IF NOT EXISTS evaluacion (
  id SERIAL PRIMARY KEY,
  rut_usuario int NOT NULL,
  id_profesor_curso int NOT NULL,
  comentario text NOT NULL,
  nota real NOT NULL DEFAULT '1',
  fecha timestamp NOT NULL,
  FOREIGN KEY (id_profesor_curso) REFERENCES profesor_curso (id),
  FOREIGN KEY (rut_usuario) REFERENCES usuario (rut)
);

CREATE TABLE IF NOT EXISTS usuario (
  rut SERIAL PRIMARY KEY,
  correo varchar(50) NOT NULL,
  nombre varchar(50) NOT NULL,
  contrasena varchar(50) NOT NULL,
  ano_ingreso date NOT NULL,
  carrera varchar(50) NOT NULL,
  es_admin boolean NOT NULL DEFAULT false
);