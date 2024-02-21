const express = require('express');
const sql = require('mssql/msnodesqlv8');
const app = express();
const port = 3000;

app.use(express.static('dist')); // Sirve los archivos desde 'dist'




// Configuración de la conexión a la base de datos
const config = {
    database: 'DDM',
    server: 'localhost',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

// Middleware para manejar errores de conexión a la base de datos
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Endpoint para el recuento de OfficialRegNo
app.get('/api/count', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`SELECT COUNT(OfficialRegNo) AS OfficialRegNoCount FROM [DDM].[dbo].[BasicAnimal] WHERE (Sex = 2) AND (ExitType IS NULL)`);
        res.json({ count: result.recordset[0].OfficialRegNoCount });
        pool.close();
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).send({ message: "Error al realizar la consulta", error: err.message });
    }
});


// Nuevo endpoint para los eventos
app.get('/api/events', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
        SELECT        TOP (100) PERCENT dbo.SystemEvent.OID, CONVERT(varchar, dbo.SystemEvent.EventTime, 103) + ' ' + CONVERT(varchar, dbo.SystemEvent.EventTime, 108) AS EventTime, dbo.SystemEvent.MajorCode, dbo.SystemEvent.MinorCode,  dbo.Device.DeviceName,  
                        
        CASE  -- Aquí se utiliza CASE para definir los valores de 'Incompleto'
        WHEN dbo.Alarm.AckType = 0 THEN 'Ninguno'
        WHEN dbo.Alarm.AckType = 1 THEN 'Confirmado'
        WHEN dbo.Alarm.AckType = 2 THEN 'Limpiado'
        WHEN dbo.Alarm.AckType = 3 THEN 'Si'
        WHEN dbo.Alarm.AckType = 4 THEN 'No'
    END AS [Acciones tomadas],
            
             CASE  -- Aquí se utiliza CASE para definir los valores de 'Incompleto'
        WHEN dbo.SystemEvent.Severity = 0 THEN 'Informe de recuperacion'
        WHEN dbo.SystemEvent.Severity = 1 THEN 'Mensaje de informacion'
        WHEN dbo.SystemEvent.Severity = 2 THEN 'Informe de error'
        WHEN dbo.SystemEvent.Severity = 3 THEN 'Alerta de error'
        WHEN dbo.SystemEvent.Severity = 4 THEN 'Notificacion usuario'
        WHEN dbo.SystemEvent.Severity = 5 THEN 'Alarma de parada'
        WHEN dbo.SystemEvent.Severity = 6 THEN 'Error peligroso'
    END AS [Tipo de alarma]
FROM            dbo.Alarm INNER JOIN
             dbo.SystemEvent ON dbo.Alarm.OID = dbo.SystemEvent.OID INNER JOIN
             dbo.Device ON dbo.Alarm.SourceId = dbo.Device.OID
WHERE (dbo.SystemEvent.EventTime > DATEADD(HOUR, -48, GETDATE())) AND (MajorCode = 5) AND (Severity = 5)

ORDER BY dbo.SystemEvent.EventTime
        `);
        console.log(result.recordset); // Agrega esto antes de res.json(result.recordset);
        res.json(result.recordset);
        pool.close();
    } catch (err) {
        console.error('Error al ejecutar la consulta de eventos:', err);
        res.status(500).send({ message: "Error al realizar la consulta de eventos", error: err.message });
    }
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Manejo global de errores de SQL
sql.on('error', err => {
    console.error(`Error de conexión a la base de datos: ${err}`);
});
