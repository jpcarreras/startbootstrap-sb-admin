window.addEventListener('DOMContentLoaded', event => {
    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        fetch('/api/events')
            .then(response => response.json())
            .then(data => {
                // Ahora que tenemos los datos, inicializamos DataTables
                let dataTable = new simpleDatatables.DataTable(datatablesSimple, {
                    data: {
                        headings: [
                            "OID",
                            "EventTime",
                            "MajorCode",
                            "MinorCode",
                            "DeviceName",
                            "Acciones tomadas",
                            "Tipo de alarma"
                        ],
                        data: data.map(item => [
                            item.OID,
                            item.EventTime,
                            item.MajorCode,
                            item.MinorCode,
                            item.DeviceName,
                            item['Acciones tomadas'],
                            item['Tipo de alarma']
                        ])
                    },
                    // Añadimos la configuración de idioma aquí
                    language: {
                        "emptyTable": "No hay datos disponibles en la tabla",
                        "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                        // Añade aquí el resto de la localización según sea necesario
                    }
                });
            })
            .catch(error => console.error('Error al cargar los eventos:', error));
    }
    
});
