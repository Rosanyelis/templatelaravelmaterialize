/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-workorder');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    const basepath = document.querySelector('html').getAttribute('data-base-url') + "assets/images/";
    const baseStorage = document.querySelector('html').getAttribute('data-base-url');
    var producto = $('#producto');
    var totalfinal = 0;
    var totalIVA = 0;
    var datosTabla = [];
    var actividades = [];
    const flatpickrDate = document.querySelector('#flatpickr-date');
    const flatpickrRange = document.querySelector('#flatpickr-range');
    var i = 1;
$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/ordenes-de-trabajo",
                data: function(d) {
                    d.start = $('#startday').val();
                    d.end = $('#endday').val();
                    d.customer_id = $('#cliente').val();
                    d.status = $('#status').val();
                }
            },
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
                {data: 'created_at', name: 'created_at'},
                {data: 'correlativo', name: 'correlativo'},
                {data: 'customer.business_name', name: 'customer.business_name'},
                {data: 'total', name: 'total'},
                {data: 'status', name: 'status'},
                {data: 'user.name', name: 'user.name'},
                {data: 'user_asigned.name', name: 'user_asigned.name'},
                {data: 'actions', name: 'actions', orderable: false, searchable: false},
            ],
            columnDefs: [
                {
                    targets: [0],
                    render: function (data) {
                        return moment(data).format('DD-MM-YYYY');
                    }
                },
                {
                    targets: [3],
                    render: function (data) {
                        return '$ ' + numberFormat2.format(data);
                    }
                },
                {
                    targets: 4,
                    render: function (data, type, row) {
                        if (data == 'Pendiente') {
                            return `
                                <button type="button" class="btn btn-primary btn-sm dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">`+data+`
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 class="dropdown-header text-uppercase">cambiar Estatus a</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('En Proceso', ${row.id})">En Proceso</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Completado', ${row.id})">Completado</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Cancelado', ${row.id})">Cancelado</a></li>
                                </ul>
                            `;
                        } else if (data == 'En Proceso') {
                            return `
                                <button type="button" class="btn btn-info btn-sm dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">`+data+`
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 class="dropdown-header text-uppercase">cambiar Estatus a</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Completado', ${row.id})">Completado</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Cancelado', ${row.id})">Cancelado</a></li>
                                </ul>
                            `;
                        } else if (data == 'Completado') {
                            return '<p class="badge bg-success">Completado</p>';
                        } else if (data == 'Cancelado') {
                            return '<p class="badge bg-danger">Cancelado</p>';
                        }
                    }
                }
            ]

        });
    }

    producto.on('select2:select', function(e) {
        var id = producto.val();
        $.ajax({
            type: 'GET',
            url: '/cotizaciones/'+id+'/productjson',
            success: function(data) {
                let costo = parseFloat(data.cost).toFixed(0);
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

        if (producto == '' || code == '' || price == '' || quantity == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes ingresar un producto',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                buttonsStyling: false
            });
        }

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
                let IDsubtotal = "#total-"+code;

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

    $('#add_task').on('click', function() {
        let task = $('#task').val();

        if (task == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debes ingresar una tarea',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                buttonsStyling: false
            })
        }

        actividades.push({
            'code': i,
            'task': task
        });

        $("#table_tasks tbody").append(
        `<tr id="row-`+i+`">
            <td>`+task+`</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm"
                    id="delete_task" data-code="`+i+`">
                    <i class="ri-delete-bin-fill"></i>
                </button>
            </td>
        </tr>`);

        $('#task').val('');

        i++;
    });

    $('#table_tasks tbody').on('click', '#delete_task', function() {
        let task = $(this).data('code');
        let id = "#row-" + task;

        actividades = actividades.filter(function(item) {
            return item.code !== task;
        });

        $(id).remove();

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

        if (actividades.length == 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No hay actividades agregadas, por favor agrega una',
                customClass: {
                    confirmButton: 'btn btn-primary waves-effect waves-light'
                    },
                buttonsStyling: false
            });
            return false;
        }

        $('#array_products').val(JSON.stringify(datosTabla));
        $('#totalcomplete').val(parseFloat($('#total').text()));
        $('#array_tasks').val(JSON.stringify(actividades));
        $('#guardar').prop('disabled', true);
        $('#guardar').html('<span class="spinner-border me-1" role="status" aria-hidden="true"></span> Por favor, espere...');
        $('#formWorkorder').submit();
    });

    if (flatpickrDate) {
        flatpickrDate.flatpickr({
          monthSelectorType: 'static',
        //   dateFormat: 'd-m-Y',
          locale: 'es'
        });
    }
    if (typeof flatpickrRange != undefined) {
        flatpickrRange.flatpickr({
          mode: 'range',
          locale: 'es'
        });
    }

    $('#flatpickr-range').on('change', function() {
        var fechaRango = $('#flatpickr-range').val(); // Obtiene el valor del input
        var fechas = fechaRango.split(" a "); // Separa las fechas por el guión

        if (fechas.length == 2) {
            $('#startday').val(fechas[0]);
            $('#endday').val(fechas[1]);
            dt_ajax_table.DataTable().ajax.reload();
        }
    });

    $('#proveedor').on('change', function() {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#clearFilter').on('click', function() {
        $('#startday').val('');
        $('#endday').val('');
        $('#proveedor').val('').trigger('change');
        $('#flatpickr-range').val('').trigger('change');
        dt_ajax_table.DataTable().ajax.reload();
    });
});


function calcular() {
    var totalfinal = 0;
    for (let i = 0; i < datosTabla.length; i++) {
        totalfinal += parseInt(datosTabla[i].subtotal);
    }

    $("#total").empty();
    $("#total").text(totalfinal.toFixed(0));
}

function viewRecord(id) {
    $.ajax({
        url: "/ordenes-de-trabajo/" + id + "/show",
        type: 'GET',
        success: function(res) {
            $('#name').text(res.customer.name);
            $('#date').text(moment(res.created_at).format('DD/MM/YYYY hh:mm A'));
            $('#totals').text(numberFormat2.format(res.total));
            $('#nfactura').text(res.correlativo);
            $('#total2').text(numberFormat2.format(res.total));
            $('#notes').text(res.notes);

            $('#estatus').text(res.status);
            $('#details').empty();
            res.tasks.forEach((value, index) => {
                $('#detailsTask')
                    .append('<tr>')
                    .append('<td>' + value.task + '</td>')
                    .append('</tr>');
            })
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

            $('#WorkOrdersModal').modal('show');
        }
    });

}


function changeStatus(status, id) {
    $('#my-form #status').val(status);
    $('#my-form #id').val(id);

    Swal.fire({
        title: '¿Esta seguro de cambiar el estado de la orden de trabajo?',
        text: "No podra cambiar el estado si es cancelado o completado!. Al completar la orden los productos seran descontados del inventario.",
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

            $('#my-form').submit();

        }
    })
}
