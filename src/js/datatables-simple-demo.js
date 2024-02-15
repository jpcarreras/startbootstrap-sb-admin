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

                    // Configuración de idioma aquí
                    language: {
                        lengthMenu: "Mostrar _MENU_ registros por página",
                        zeroRecords: "Ningún usuario encontrado",
                        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
                        infoEmpty: "Ningún usuario encontrado",
                        infoFiltered: "(filtrados desde _MAX_ registros totales)",
                        search: "Buscar:",
                        loadingRecords: "Cargando...",
                        paginate: {
                            first: "Primero",
                            last: "Último",
                            next: "Siguiente",
                            previous: "Anterior"
                        }
                    }
                });
            })
            .catch(error => console.error('Error al cargar los eventos:', error));
    }
    
});
