let dataTable; // Variable para almacenar la instancia de DataTable
let dataTableIsInitialized = false; // Bandera para controlar la inicialización

document.addEventListener('DOMContentLoaded', async function () {
    await initDataTable();
});

const initDataTable = async () => {
    if (dataTableIsInitialized && dataTable) {
        dataTable.destroy(); // Destruimos la instancia anterior
    }

    try {
        const response = await fetch('/api/events');
        const data = await response.json();

        // Preparamos los datos para DataTables
        var transformedData = data.map(item => [
            item.OID,
            item.EventTime,
            item.MajorCode,
            item.MinorCode,
            item.DeviceName,
            item['Acciones tomadas'],
            item['Tipo de alarma']
        ]);

        // Opciones de DataTable personalizadas
        const dataTableOptions = {
            
            data: transformedData,
            columns: [
                { title: "OID" },
                { title: "EventTime" },
                { title: "MajorCode" },
                { title: "MinorCode" },
                { title: "DeviceName" },
                { title: "Acciones tomadas" },
                { title: "Tipo de alarma" }
            ],
            columnDefs: [
                { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] },
                { orderable: false, targets: [5, 6] },
                { searchable: true, targets: [4] },
                
            ],
            searchable: true, targets: [4] ,
            pageLength: 10, // Cambiado según preferencia
            destroy: true, // Asegura que podemos reinicializar sin problemas
            language: {
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "Ningún usuario encontrado",
                info: "Mostrando de _START_ a _END_ registros de un total de _TOTAL_",
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
        };

        // Inicializamos DataTables con las opciones personalizadas
        dataTable = $('#datatablesSimple2').DataTable(dataTableOptions);
        dataTableIsInitialized = true; // Marcamos como inicializada
    } catch (error) {
        console.error('Error al cargar los eventos:', error);
    }
};
