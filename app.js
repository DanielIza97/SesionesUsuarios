const express = require("express");
const { Pool } = require("pg");

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: "regula",
  host: "localhost",
  database: "regula",
  password: "dipse2023",
  port: 5432,
});

const app = express();

// Middleware para analizar application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener registros según los datos enviados en el cuerpo de la solicitud
app.post('/api/registros_sesion', async (req, res) => {
    const { usuarioId, transactionId } = req.body; // Aquí obtienes los datos del cuerpo de la solicitud
    console.log('Datos recibidos',req.body);
    try {
      const client = await pool.connect()
      const result = await client.query(`
        SELECT 
            usuarios.cedula,
            registros_sesion.id AS registros_sesion_id, 
            transactionid,
            success,
            fecha_hora
        FROM 
            registros_sesion
        JOIN 
            usuarios ON registros_sesion.usuario_id = usuarios.id
        WHERE 
            usuarios.cedula = $1
        AND
            registros_sesion.transactionid = $2`, [usuarioId, transactionId]);
      client.release()
      // Validar los datos
        const registrosValidados = result.rows.map(registro => {
            const { cedula, registros_sesion_id, transactionid, success, fecha_hora } = registro;
            const fechaHoraActual = new Date();
            console.log('fechaHoraActual',fechaHoraActual);
            console.log('fechaHoraActual',fechaHoraActual.getTime());
            const fechaHoraRegistro = new Date(fecha_hora);
            console.log('fechaHoraRegistro',fechaHoraRegistro);
            const esDelDiaActual = fechaHoraActual.toDateString() === fechaHoraRegistro.toDateString();
            console.log('esDelDiaActual',esDelDiaActual);
            const esSuccessValido = success === true || success === false;
            console.log('esSuccessValido',esSuccessValido);

            return {
            cedula,
            transactionid,
            success,
            fecha_hora,
            esDelDiaActual,
            esSuccessValido
            };
        });
      res.json(registrosValidados)
    } catch (err) {
      console.error('Error al obtener registros', err)
      res.status(500).json({ error: 'Error al obtener registros' })
    }
});
  


// Ruta para obtener todos los registros de la tabla
// app.get("/api/registros", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query(`
//     SELECT 
//         usuarios.cedula,
//         registros_sesion.id AS registros_sesion_id, 
//         transactionid,
//         success,
//         fecha_hora
//     FROM 
//         registros_sesion
//     JOIN 
//         usuarios ON registros_sesion.usuario_id = usuarios.id`);

//     client.release();
//     console.log(`ejecutado: ${PORT}`);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Error al obtener registros", err);
//     res.status(500).json({ error: "Error al obtener registros" });
//   }
// });

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});