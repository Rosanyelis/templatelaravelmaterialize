/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-contract');
    var dt_ajax_table_due = $('.datatables-contract-due');
    var dt_ajax_table_renew = $('.datatables-contract-renew');


    const numberFormat2 = new Intl.NumberFormat('de-DE');
    const basepath = document.querySelector('html').getAttribute('data-base-url') + "assets/images/";
    const baseStorage = document.querySelector('html').getAttribute('data-base-url');
    var producto = $('#producto');
    var totalfinal = 0;
    var totalIVA = 0;
    var datosTabla = [];

$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/contratos",
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
                {data: 'correlativo', name: 'correlativo'},
                {data: 'customer.business_name', name: 'customer.business_name'},
                {data: 'type_contract', name: 'type_contract'},
                {data: 'end_date', name: 'end_date'},
                {data: 'type', name: 'type'},
                {data: 'grand_total', name: 'grand_total'},
                {data: 'status', name: 'status'},
                {data: 'actions', name: 'actions', orderable: false, searchable: false},
            ],
            columnDefs: [
                {
                    targets: [3],
                    render: function (data) {
                        moment.locale('es');
                        return moment(data).format('LL');
                    }
                },
                {
                    targets: [4],
                    render: function (data) {
                        if (data == 'annual') {
                            return 'Anual';
                        }
                        if (data == 'two years') {
                            return 'Bianual';
                        }
                    }
                },
                {
                    targets: [5],
                    render: function (data) {
                        return '$ ' + numberFormat2.format(data);
                    }
                },
                {
                    targets: [6],
                    render: function (data) {
                        if (data == 'Por Facturar') {
                            return '<span class="badge bg-warning">Por Facturar</span>';
                        }
                        if (data == 'Activo') {
                            return '<span class="badge bg-success">Activo</span>';
                        }
                        if (data == 'Vencido') {
                            return '<span class="badge bg-danger">Vencido</span>';
                        }
                    }
                },

            ]

        });
    }

    if (dt_ajax_table_due.length) {
        var dt_ajax_due = dt_ajax_table_due.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/contratos/datatable-due",
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
                {data: 'correlativo', name: 'correlativo'},
                {data: 'customer.business_name', name: 'customer.business_name'},
                {data: 'type_contract', name: 'type_contract'},
                {data: 'end_date', name: 'end_date'},
                {data: 'type', name: 'type'},
                {data: 'grand_total', name: 'grand_total'},
                {data: 'status', name: 'status'},
                {data: 'actions', name: 'actions', orderable: false, searchable: false},
            ],
            columnDefs: [
                {
                    targets: [3],
                    render: function (data) {
                        moment.locale('es');
                        return moment(data).format('LL');
                    }
                },
                {
                    targets: [4],
                    render: function (data) {
                        if (data == 'annual') {
                            return 'Anual';
                        }
                        if (data == 'two years') {
                            return 'Bianual';
                        }
                    }
                },
                {
                    targets: [5],
                    render: function (data) {
                        return '$ ' + numberFormat2.format(data);
                    }
                },
                {
                    targets: [6],
                    render: function (data) {
                        if (data == 'Por Facturar') {
                            return '<span class="badge bg-warning">Por Facturar</span>';
                        }
                        if (data == 'Activo') {
                            return '<span class="badge bg-success">Activo</span>';
                        }
                        if (data == 'Vencido') {
                            return '<span class="badge bg-danger">Vencido</span>';
                        }
                    }
                },

            ]

        });
    }

    if (dt_ajax_table_renew.length) {
        var dt_ajax_renew = dt_ajax_table_renew.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/contratos/datatable-renew",
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
                {data: 'correlativo', name: 'correlativo'},
                {data: 'customer.business_name', name: 'customer.business_name'},
                {data: 'type_contract', name: 'type_contract'},
                {data: 'end_date', name: 'end_date'},
                {data: 'type', name: 'type'},
                {data: 'grand_total', name: 'grand_total'},
                {data: 'status', name: 'status'},
            ],
            columnDefs: [
                {
                    targets: [3],
                    render: function (data) {
                        moment.locale('es');
                        return moment(data).format('LL');
                    }
                },
                {
                    targets: [4],
                    render: function (data) {
                        if (data == 'annual') {
                            return 'Anual';
                        }
                        if (data == 'two years') {
                            return 'Bianual';
                        }
                    }
                },
                {
                    targets: [5],
                    render: function (data) {
                        return '$ ' + numberFormat2.format(data);
                    }
                },
                {
                    targets: [6],
                    render: function (data) {
                        if (data == 'Por Facturar') {
                            return '<span class="badge bg-warning">Por Facturar</span>';
                        }
                        if (data == 'Activo') {
                            return '<span class="badge bg-success">Activo</span>';
                        }
                        if (data == 'Vencido') {
                            return '<span class="badge bg-danger">Vencido</span>';
                        }
                    }
                },

            ]

        });
    }

    producto.on('select2:select', function(e) {
        var id = producto.val();
        $.ajax({
            type: 'GET',
            url: '/cotizaciones/'+id+'/productjson',
            success: function(data) {
                let costo = parseFloat(data.price).toFixed(0);
                $('#priceCost').val(costo);
                $('#product_name').val(data.name);
                $('#product_code').val(data.code);
            }
        });
    });

    $('#add_product').on('click', function() {
        let producto = $('#product_name').val();
        let details = $('#details').val();
        let code = $('#product_code').val();
        let price = parseFloat($('#priceCost').val());
        let quantity = parseFloat($('#quantity').val());
        let totalp = price * quantity;
        let subtotal = totalp;

        if (datosTabla.length > 0) {
            let index = datosTabla.findIndex((item) => item.code == code);

            if (index == -1) {
                datosTabla.push({
                    'code': code,
                    'product': producto,
                    'details': details,
                    'quantity': quantity,
                    'price': price,
                    'subtotal': subtotal.toFixed(0)
                });

                $("#table_products tbody").append(
                `<tr id="row-`+code+`">
                    <td>`+producto+`</td>
                    <td>`+details+`</td>
                    <td id="quantity-`+code+`">`+quantity+`</td>
                    <td id="price-`+code+`">`+price+`</td>
                    <td id="subtotal-`+code+`">`+subtotal.toFixed(0)+`</td>
                    <td>
                        <button type="button" class="btn btn-danger btn-sm"
                            id="delete_product" data-code="`+code+`">
                            <i class="ri-delete-bin-fill"></i>
                        </button>
                    </td>
                </tr>`);

            }

            if (index != -1) {
                datosTabla[index].quantity += quantity;
                datosTabla[index].price = price;
                datosTabla[index].subtotal = datosTabla[index].quantity * datosTabla[index].price;

                let IDqty = "#quantity-"+code;
                let IDprice = "#price-"+code;
                let IDsubtotal = "#subtotal-"+code;

                $(IDqty).text(datosTabla[index].quantity);
                $(IDprice).text(datosTabla[index].price);
                $(IDsubtotal).text(datosTabla[index].subtotal);
            }
        }

        if (datosTabla.length == 0 ) {
            datosTabla.push({
                'code': code,
                'product': producto,
                'details': details,
                'quantity': quantity,
                'price': price,
                'subtotal': subtotal.toFixed(0)
            });

            $("#table_products tbody").append(
            `<tr id="row-`+code+`">
                <td>`+producto+`</td>
                    <td>`+details+`</td>
                    <td id="quantity-`+code+`">`+quantity+`</td>
                    <td id="price-`+code+`">`+price+`</td>
                    <td id="subtotal-`+code+`">`+subtotal.toFixed(0)+`</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm"
                        id="delete_product" data-code="`+code+`">
                        <i class="ri-delete-bin-fill"></i>
                    </button>
                </td>
            </tr>`);

        }
        calcular();
        $("#producto").val(null).trigger("change");
        $("#product_name").val("");
        $("#costo_venta").val('');
        $("#quantity").val('');
        $("#details").val('');
        $('#priceCost').val('');
        $('#product_name').val('');
        $('#product_code').val('');

    });

    $('#table_products tbody').on('click', '#delete_product', function() {
        let product = $(this).data('code');
        let id = "#row-" + product;

        datosTabla = datosTabla.filter(function(item) {
            return item.code !== product;
        });

        $(id).remove();

        calcular();
    });

    $('#guardar').on('click', function() {
        if (datosTabla.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay productos agregados, por favor agrega uno',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                buttonsStyling: false
            });
            return false;
        }

        $('#array_products').val(JSON.stringify(datosTabla));
        $('#subtotalcomplete').val(parseFloat($('#subtotal').text()));
        $('#totalcomplete').val(parseFloat($('#total').text()));
        $('#ivacomplete').val(parseFloat($('#iva').text()));
        $('#guardar').prop('disabled', true);
        $('#guardar').html('<span class="spinner-border me-1" role="status" aria-hidden="true"></span> Por favor, espere...');
        $('#formContract').submit();
    });

    $('#flatpickr-date').flatpickr({
        monthSelectorType: 'static',
    //   dateFormat: 'd-m-Y',
        locale: 'es'
    });
});



function calcular() {
    var totalfinal = 0;
    var totalIVA = 0;
    var total = 0;
    for (let i = 0; i < datosTabla.length; i++) {
        totalfinal += parseInt(datosTabla[i].subtotal);
    }
    totalIVA = parseFloat(totalfinal) * 0.19;
    total = totalfinal + totalIVA;
    $("#subtotal").empty();
    $("#subtotal").text(parseFloat(totalfinal).toFixed(0));
    $("#iva").empty();
    $("#iva").text(totalIVA.toFixed(0));
    $("#total").empty();
    $("#total").text(total.toFixed(0));
}

function viewRecord(id) {
    $.ajax({
        url: "/contratos/" + id + "/show",
        type: 'GET',
        success: function(res) {
            console.log(res);
            $('#correlativo').text(res.correlativo);
            $('#bussines_name').text(res.customer.business_name);
            $('#type_contract').text(res.type_contract);
            $('#type').text((res.type == 'annual') ? 'Anual' : 'Bianual');
            $('#start_date').text(res.start_date);
            $('#end_date').text(res.end_date);
            $('#dominio').text(res.dominio);
            $('#estatus').text(res.status);
            $('#note').text(res.note);
            if (res.file != '') {
                $('#file').empty();
                $('#file').append('<a href="' + baseStorage + res.file + '" target="_blank">Ver propuesta</a>');
            }
            if (res.file == null){
                $('#file').empty();
                $('#file').append('Sin archivo');
            }
            $('#subtotal').text(numberFormat2.format(res.subtotal));
            $('#iva').text(numberFormat2.format(res.iva));
            $('#total').text(numberFormat2.format(res.grand_total));
            $('#details').empty();
            res.items.forEach((value, index) => {
                $('#details')
                    .append('<tr>')
                    .append('<td>' + value.product.name + '</td>')
                    .append('<td>' + value.details + '</td>')
                    .append('<td>' + value.quantity + '</td>')
                    .append('<td>' + numberFormat2.format(value.price) + '</td>')
                    .append('<td>' + numberFormat2.format(value.total) + '</td>')
                    .append('</tr>');
            })

            $('#ContractsModal').modal('show');
        }
    });

}

function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar este Contrato?',
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
                "/contratos/"+id+"/delete";
        }
    })
}
