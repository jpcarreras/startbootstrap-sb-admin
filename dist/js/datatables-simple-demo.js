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
                    }
                });
            })
            .catch(error => console.error('Error al cargar los eventos:', error));
    }
});
