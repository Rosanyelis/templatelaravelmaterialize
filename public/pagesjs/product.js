/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-product');
    var category = $('#category_id');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/productos/datatable",
                data: function (d) {
                    d.category_id = category.val();
                }
            },
            // ajax: "",
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
                {
                    data: 'code',
                    name: 'code'
                },
                {
                    data: 'name',
                    name: 'name',
                    orderable: true,
                    searchable: true
                },
                {
                    data: 'category.name',
                    name: 'category.name'
                },
                {
                    data: 'type',
                    name: 'type'
                },
                {
                    data: 'quantity',
                    name: 'quantity'
                },
                {
                    data: 'cost',
                    name: 'cost'
                },
                {
                    data: 'price',
                    name: 'price'
                },
                {
                    data: 'actions',
                    name: 'actions',
                    orderable: false,
                    searchable: false
                },
            ],
            columnDefs: [{
                targets: [5,6],
                render: function (data) {
                    return '$ ' + numberFormat2.format(data);
                }
            }]
        });
    }

    category.on('change', function () {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#type').on('change', function () {
        if ($(this).val() == 'Servicios') {
            $('#quantity').prop('disabled', true);
        }else {
            $('#quantity').prop('disabled', false);
        }
    });

    if ($('#type').val() == 'Servicios') {
        $('#quantity').prop('disabled', true);
    }else {
        $('#quantity').prop('disabled', false);
    }
});
function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar este Producto?',
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
            window.location.href =
                "/productos/"+id+"/delete";
        }
    })
}
