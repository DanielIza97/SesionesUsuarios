-- 1. Crear la base de datos 'Regula'
CREATE DATABASE Regula;

-- 2. Conectarse a la base de datos 'Regula'
\c Regula;

-- 3. Crear la tabla 'usuarios'
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100),
    correo VARCHAR(100)
);

-- 4. Crear la tabla 'registros_sesion'
CREATE TABLE registros_sesion (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    transactionid VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insertar algunos datos de ejemplo (opcional)
INSERT INTO usuarios (cedula, nombre, correo) VALUES
('1234567890', 'Anderson Iza', 'anderson@example.com'),
('0987654321', 'Juan Perez', 'juan@example.com');

INSERT INTO registros_sesion (usuario_id, transactionid, success) VALUES
(1, 'txn001', TRUE),
(2, 'txn002', FALSE);
