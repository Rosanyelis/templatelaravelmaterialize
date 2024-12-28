/**
 * DataTables Advanced (jquery)
 */

'use strict';

    var dt_ajax_table = $('.datatables-purchase');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    var producto = $('#producto');
    const basepath = document.querySelector('html').getAttribute('data-base-url') + "assets/images/";
    const baseStorage = document.querySelector('html').getAttribute('data-base-url');
    var totalfinal = 0;
    var datosTabla = [];
    var totalCotizado = 0;
    var startInput;
    var endInput;
    const flatpickrDate = document.querySelector('#flatpickr-date');
    const flatpickrRange = document.querySelector('#flatpickr-range');
$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: {
                url: "/compras/datatable",
                data: function(d) {
                    d.start = $('#startday').val();
                    d.end = $('#endday').val();
                    d.supplier_id = $('#proveedor').val();
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
                {
                    data: 'created_at',
                    name: 'created_at'
                },
                {
                    data: 'supplier',
                    name: 'supplier'
                },
                {
                    data: 'reference',
                    name: 'reference'
                },
                {
                    data: 'total',
                    name: 'total'
                },
                {
                    data: 'note',
                    name: 'note'
                },
                {
                    data: 'received',
                    name: 'received'
                },
                {
                    data: 'actions',
                    name: 'actions',
                    orderable: false,
                    searchable: false
                },
            ],
            columnDefs: [{
                targets: 0,
                render: function (data) {
                    return moment(data).format('DD/MM/YYYY hh:mm A');
                }
            },
            {
                targets: 3,
                render: function (data) {
                    return '$ ' + numberFormat2.format(data);
                }
            },
            {
                targets: [5],
                render: function (data, type, row) {
                    if (data == 0) {
                        return `<button type="button" class="btn btn-danger btn-sm dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">No Recibido
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 class="dropdown-header text-uppercase">cambiar a</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Recibido', ${row.id})">Recibido</a></li>
                                </ul>`;
                    }
                    if (data == 1) {
                        return '<span class="badge bg-success">Recibido</span>';
                    }

                }
            }],
            footerCallback: function (row, data, start, end, display) {
                let api = this.api();

                let total = api
                    .column(3)
                    .data()
                    .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                    }, 0);

                $('#totalCotizado').html(
                    '$ ' + numberFormat2.format(total)
                );
            }
        });
    }

    producto.on('select2:select', function(e) {
        var id = producto.val();
        $.ajax({
            type: 'GET',
            url: '/compras/'+id+'/productjson',
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
        console.log();

        let code = $('#product_code').val();
        let price = parseFloat($('#priceCost').val());
        let quantity = parseFloat($('#quantity').val());
        let total = price * quantity;

        if (datosTabla.length > 0) {
            let index = datosTabla.findIndex((item) => item.code == code);

            if (index == -1) {
                datosTabla.push({
                    'code': code,
                    'product': producto,
                    'quantity': quantity,
                    'price': price,
                    'total': total.toFixed(0),
                });

                $("#table_products tbody").append(
                `<tr id="row-`+code+`">
                    <td>`+producto+`</td>
                    <td id="quantity-`+code+`">`+quantity+`</td>
                    <td id="price-`+code+`">`+price+`</td>
                    <td id="total-`+code+`">`+total.toFixed(0)+`</td>
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
                datosTabla[index].total = datosTabla[index].quantity * datosTabla[index].price;

                let IDqty = "#quantity-"+code;
                let IDprice = "#price-"+code;
                let IDtotal = "#total-"+code;

                $(IDqty).text(datosTabla[index].quantity);
                $(IDprice).text(datosTabla[index].price);
                $(IDtotal).text(datosTabla[index].total);
            }
        }

        if (datosTabla.length == 0 ) {
            datosTabla.push({
                'code': code,
                'product': producto,
                'quantity': quantity,
                'price': price,
                'total': total.toFixed(0),
            });

            $("#table_products tbody").append(
            `<tr id="row-`+code+`">
                <td>`+producto+`</td>
                <td id="quantity-`+code+`">`+quantity+`</td>
                <td id="price-`+code+`">`+price+`</td>
                <td id="total-`+code+`">`+total.toFixed(0)+`</td>
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
        $("#priceCost").val('');
        $("#quantity").val('');
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
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'Cancelar',
                customClass: {
                  confirmButton: 'btn btn-primary me-3 waves-effect waves-light',
                  cancelButton: 'btn btn-outline-danger waves-effect'
                },
                buttonsStyling: false
            });
            return false;
        }

        $('#array_products').val(JSON.stringify(datosTabla));
        $('#totalcomplete').val(parseFloat($('#total').text()));
        $('#guardar').prop('disabled', true);
        $('#guardar').html('<span class="spinner-border me-1" role="status" aria-hidden="true"></span> Por favor, espere...');
        $('#formPurchase').submit();
    });

    $('#flatpickr-date').flatpickr({
        monthSelectorType: 'static',
    //   dateFormat: 'd-m-Y',
        locale: 'es'
    });

    $('#flatpickr-range').flatpickr({
        mode: 'range',
        locale: 'es'
    });

    $('#flatpickr-range').on('change', function() {
        var fechaRango = $('#flatpickr-range').val(); // Obtiene el valor del input
        var fechas = fechaRango.split(" a "); // Separa las fechas por el guión

        if (fechas.length == 2) {
            $('#startday').val(fechas[0]);
            $('#endday').val(fechas[1]);
            console.log(fechas[0], fechas[1]);

            dt_ajax_table.DataTable().ajax.reload();
        }
    });

    $('#proveedor').on('change', function() {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#status').on('change', function() {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#clearFilter').on('click', function() {
        $('#startday').val('');
        $('#endday').val('');
        $('#proveedor').val('').trigger('change');
        $('#status').val('').trigger('change');
        $('#flatpickr-range').val('').trigger('change');
        dt_ajax_table.DataTable().ajax.reload();
    })
});

function calcular() {
    var totalfinal = 0;
    for (let i = 0; i < datosTabla.length; i++) {
        totalfinal += parseInt(datosTabla[i].total);
    }
    $("#total").empty();
    $("#total").text(totalfinal.toFixed(0));
}

function viewRecord(id) {
    $.ajax({
        url: "/compras/" + id + "/show",
        type: 'GET',
        success: function(res) {
            $('#name').text(res.supplier.name);
            $('#date').text(moment(res.created_at).format('DD/MM/YYYY hh:mm A'));
            $('#total').text(numberFormat2.format(res.total));
            $('#note').text(res.note);
            $('#total2').text(numberFormat2.format(res.total));
            if (res.received == '1') {
                $('#recibido').text('Recibido');
            } else {
                $('#recibido').text('No Recibido');
            }
            $('#type').text(res.type_purchase);
            $('#nfactura').text(res.reference);

            if (res.files != null) {
                $('#files').append('<a href="' + baseStorage + res.files + '" class="btn btn-info" download target="_blank">Ver Factura de Compra</a>');
            }
            if (res.files == null){
                $('#file').empty();
                $('#file').append('Sin archivo');
            }

            $('#details').empty();
            res.items.forEach((value, index) => {
                $('#details')
                    .append('<tr>')
                    .append('<td>' + value.product.name + '</td>')
                    .append('<td>' + value.quantity + '</td>')
                    .append('<td>' + numberFormat2.format(value.cost) + '</td>')
                    .append('<td>' + numberFormat2.format(value.subtotal) + '</td>')
                    .append('</tr>');
            })

            $('#PurchaseModal').modal('show');
        }
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

    // $('#vendedor').on('change', function() {
    //     dt_ajax_table.DataTable().ajax.reload();
    // });

    // $('#cliente').on('change', function() {
    //     dt_ajax_table.DataTable().ajax.reload();
    // });

    // $('#status').on('change', function() {
    //     dt_ajax_table.DataTable().ajax.reload();
    // });

    // $('#clearFilter').on('click', function() {
    //     $('#startday').val('');
    //     $('#endday').val('');
    //     $('#vendedor').val('').trigger('change');
    //     $('#cliente').val('').trigger('change');
    //     $('#status').val('').trigger('change');
    //     $('#flatpickr-range').val('').trigger('change');
    //     dt_ajax_table.DataTable().ajax.reload();
    // })

}


$('#close').on('click', function() {
    $('#myModal').modal('hide');
    $('#name').text('');
    $('#date').text('');
    $('#total').text('');
    $('#note').text('');
    $('#total2').text('');
    $('#received').text('');
    $('#nfactura').text('');
    $('#details').empty();
});

function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar esta Compra?',
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
                "/compras/"+id+"/delete";
        }
    })
}

function changeStatus(status, id) {
    $('#my-form #status').val('1');
    $('#my-form #id').val(id);

    Swal.fire({
        title: '¿Esta seguro de cambiar el estado a "' + status + '" de la Compra?',
        text: "No podra cambiar el estado si es Recibido!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, cambiar!',
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
    });
}
