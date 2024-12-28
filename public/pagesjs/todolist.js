/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-task');
    var addTask = $('#add-todo');
$(function () {


    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/tareas",
            dataType: 'json',
            type: "POST",
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            language: {
                url: "https://cdn.datatables.net/plug-ins/2.0.8/i18n/es-ES.json",
                paginate: {
                    next: '<i class="ri-arrow-right-s-line"></i>',
                    previous: '<i class="ri-arrow-left-s-line"></i>'
                }
            },
            columns: [
                {data: 'id', name: 'id'},
                {data: 'task', name: 'task'},
                {data: 'fecha_inicio', name: 'fecha_inicio'},
                {data: 'fecha_fin', name: 'fecha_fin'},
                {data: 'asignados', name: 'asignados'},
                {data: 'actions', name: 'actions', orderable: false, searchable: false},
            ],
            columnDefs: [
                {targets: 0,
                    render: function (data, type, row, meta) {
                        return `<div class="form-check font-size-16">
                                <input class="form-check-input" type="checkbox" id="check${data}"
                                onclick="changeStatus(${data},${row.status})" value="${data}"
                                ${row.status == 1 ? 'checked' : ''}>
                                <label class="form-check-label" for="check${data}"></label>
                            </div>`
                    }

                },
                {
                    targets: 1,
                    render: function (data, type, row, meta) {
                        // Inicializar la variable de clases
                        let classes = "";

                        // Validar las condiciones y agregar clases según corresponda
                        if (row.status == 1) {
                            classes += "tachado ";
                        }
                        if (row.fecha_fin < moment().format('YYYY-MM-DD')) {
                            classes += "text-danger ";
                        }

                        // Retornar el dato envuelto en <p> con las clases aplicadas
                        return `<p class="${classes.trim()}">${data}</p>`;
                    }
                },
                {
                    targets: [2, 3],
                    render: function (data) {
                        return moment(data).format('DD/MM/YYYY');
                    }
                }
            ]
        });
    }

    $('#flatpickr-date').flatpickr({
        monthSelectorType: 'static',
    //   dateFormat: 'd-m-Y',
        locale: 'es'
    });
    $('#flatpickr-date2').flatpickr({
        monthSelectorType: 'static',
    //   dateFormat: 'd-m-Y',
        locale: 'es'
    });

    $('#flatpickr-date2').on('change', function() {
        if ($('#flatpickr-date2').val() < $('#flatpickr-date').val()) {
            Swal.fire({
                position: 'top-center',
                icon: 'warning',
                title: 'La fecha inicial no puede ser mayor a la fecha final',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                buttonsStyling: false

            });
            $('#flatpickr-date').val('');
            $('#flatpickr-date2').val('');

        }
    });

});



function changeStatus(id, status) {
    $.ajax({
        url: "/tareas/cambiar-estado",
        type: "POST",
        data: {
            id: id,
            status: status,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
        dataType: 'json',
        success: function (data) {
            if (data.status == 'success') {
                dt_ajax_table.DataTable().ajax.reload();
            }
        }
    });

}
function deleteRecord(id) {
    Swal.fire({
        title: '¿Esta seguro de eliminar esta Tarea?',
        text: "No podra recuperar la información!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar!',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
          cancelButton: 'btn btn-outline-danger waves-effect'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "/tareas/destroy",
                type: "POST",
                data: {
                    id: id,
                    _token: $('meta[name="csrf-token"]').attr('content')
                },
                dataType: 'json',
                success: function (data) {
                    if (data.status == 'success') {
                        dt_ajax_table.DataTable().ajax.reload();
                        Swal.fire({
                            position: 'top-center',
                            icon: 'success',
                            title: 'Tarea eliminada correctamente',
                            customClass: {
                                confirmButton: 'btn btn-primary waves-effect waves-light'
                              },
                            buttonsStyling: false
                        })
                    }
                }
            })
        }
    })
}
