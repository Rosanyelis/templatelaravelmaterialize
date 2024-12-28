/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-supplier');

$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/proveedores",
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
                {data: 'business_name', name: 'business_name'},
                {data: 'rut', name: 'rut'},
                {data: 'name', name: 'name'},
                {data: 'email', name: 'email'},
                {data: 'phone', name: 'phone'},
                {data: 'actions', name: 'actions', orderable: false, searchable: false},
            ],

        });
    }

    var Fn = {
        // Valida el rut con su cadena completa "XXXXXXXX-X"
        validaRut: function (rutCompleto) {
            rutCompleto = rutCompleto.replace("‐", "-");
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                return false;
            var tmp = rutCompleto.split('-');
            var digv = tmp[1];
            var rut = tmp[0];
            if (digv == 'K') digv = 'k';

            return (Fn.dv(rut) == digv);
        },
        dv: function (T) {
            var M = 0,
                S = 1;
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11;
            return S ? S - 1 : 'k';
        }
    }

    $('#rut').on('change', function () {
        if (Fn.validaRut($("#rut").val())) {
            alert("El rut ingresado es válido :D");
        } else {
            alert("El Rut no es válido :'( ");
            $('#rut').val('');
        }
    });

});

function viewRecord(id) {
    $.ajax({
        url: "/proveedor/" + id + "/show",
        type: 'GET',
        success: function(res) {
            // limpiamos campos antes de mostrar
            $('#bussines_name').text('');
            $('#rut').text('');
            $('#contacto').text('');
            $('#giro').text('');
            $('#email').text('');
            $('#phone').text('');
            $('#email').text('');
            $('#comuna').text('');
            $('#address').text('');
            // mostramos campos
            $('#bussines_name').text(res.business_name);
            $('#rut').text(res.rut);
            $('#contacto').text(res.name);
            $('#giro').text(res.giro);
            $('#email').text(res.email);
            $('#phone').text(res.phone);
            $('#email').text(res.email);
            $('#comuna').text(res.comuna);
            $('#address').text(res.address);
            // mostramos modal
            $('#myModalSupplier').modal('show');
        }
    });

}

function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar este Proveedor?',
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
                "/proveedores/"+id+"/delete";
        }
    })
}
