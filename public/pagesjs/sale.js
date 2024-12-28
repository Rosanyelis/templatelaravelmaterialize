/**
 * DataTables Advanced (jquery)
 */

'use strict';

    var dt_ajax_table = $('.datatables-sale');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    var producto = $('#producto');
    const basepath = "http://tigroup.test/assets/images/";
    const baseStorage = "http://tigroup.test/";
    var totalfinal = 0;
    var totalIVA = 0;
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
                url: "/ventas/datatable",
                data: function(d) {
                    d.start = startInput;
                    d.end = endInput;
                    d.user_id = $('#vendedor').val();
                    d.customer_id = $('#cliente').val();
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
                    data: 'invoice.correlativo',
                    name: 'invoice.correlativo'
                },
                {
                    data: 'type',
                    name: 'type'
                },
                {
                    data: 'customer.business_name',
                    name: 'customer.business_name',
                },
                {
                    data: 'user.name',
                    name: 'user.name'
                },
                {
                    data: 'subtotal',
                    name: 'subtotal'
                },
                {
                    data: 'grand_total',
                    name: 'grand_total'
                },
                {
                    data: 'payment_form',
                    name: 'payment_form'
                }
            ],
            columnDefs: [{
                targets: [0],
                render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                targets: [2],
                render: function (data) {
                    if (data == 'Contract') {
                        return 'Contrato';
                    }
                    if (data == 'Contract Renewed') {
                        return 'Contrato Renovado';
                    }
                    if (data == 'Quotation') {
                        return 'Cotización';
                    }
                    if (data == 'Invoice External') {
                        return 'Factura Externa';
                    }
                }
            },
            {
                targets:[5, 6],
                render: function (data) {
                    return '$ ' + numberFormat2.format(data);
                }
            },
            {
                targets: [7],
                render: function (data, type, row) {
                    if (data == 'Sin Definir') {
                        return '<span class="badge bg-dark">Sin Definir</span>';
                    }

                    if (data != 'Sin Definir') {
                        return '<span class="badge bg-info"><i class="ri-money-dollar-circle-line"></i> ' + data + '</span>';

                    }
                }
            }],
            footerCallback: function (row, data, start, end, display) {
                let api = this.api();

                let total = api
                    .column(5)
                    .data()
                    .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                    }, 0);

                $('#totalVentas').html(
                    '$ ' + numberFormat2.format(total)
                );
            }
        });
    }


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
            dt_ajax_table.DataTable().ajax.reload();
        }
    });

    $('#vendedor').on('change', function() {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#cliente').on('change', function() {
        dt_ajax_table.DataTable().ajax.reload();
    });

    $('#clearFilter').on('click', function() {
        $('#startday').val('');
        $('#endday').val('');
        $('#vendedor').val('').trigger('change');
        $('#cliente').val('').trigger('change');
        $('#flatpickr-range').val('').trigger('change');
        dt_ajax_table.DataTable().ajax.reload();
    })

    $('#add_product').on('click', function() {
        let producto = $('#product_name').val();
        let code = $('#product_code').val();
        let price = parseFloat($('#priceCost').val());
        let quantity = parseFloat($('#quantity').val());
        let profit = ($('#profit').val() == '') ? 0 : parseFloat($('#profit').val());
        let totalp = price * quantity;
        let margen;
        if (profit == 0) {
            margen = 0;
        } else {
            margen = totalp * (profit / 100);
        }
        let subtotal = totalp + margen;

        if (datosTabla.length > 0) {
            let index = datosTabla.findIndex((item) => item.code == code);

            if (index == -1) {
                datosTabla.push({
                    'code': code,
                    'product': producto,
                    'quantity': quantity,
                    'price': price,
                    'profit': profit,
                    'margen': margen.toFixed(0),
                    'subtotal': subtotal.toFixed(0)
                });

                $("#table_products tbody").append(
                `<tr id="row-`+code+`">
                    <td>`+producto+`</td>
                    <td id="quantity-`+code+`">`+quantity+`</td>
                    <td id="price-`+code+`">`+price+`</td>
                    <td id="profit-`+code+`">`+profit+`</td>
                    <td id="margen-`+code+`">`+margen.toFixed(0)+`</td>
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
                datosTabla[index].profit = profit;
                datosTabla[index].margen = datosTabla[index].price * (profit / 100);
                datosTabla[index].subtotal = (datosTabla[index].quantity * datosTabla[index].price) + datosTabla[index].margen;

                let IDqty = "#quantity-"+code;
                let IDprice = "#price-"+code;
                let IDprofit = "#profit-"+code;
                let IDmargen = "#margen-"+code;
                let IDsubtotal = "#subtotal-"+code;

                $(IDqty).text(datosTabla[index].quantity);
                $(IDprice).text(datosTabla[index].price);
                $(IDprofit).text(datosTabla[index].profit);
                $(IDmargen).text(datosTabla[index].margen);
                $(IDsubtotal).text(datosTabla[index].subtotal);
            }
        }

        if (datosTabla.length == 0 ) {
            datosTabla.push({
                'code': code,
                'product': producto,
                'quantity': quantity,
                'price': price,
                'profit': profit,
                'margen': margen.toFixed(0),
                'subtotal': subtotal.toFixed(0)
            });

            $("#table_products tbody").append(
            `<tr id="row-`+code+`">
                <td>`+producto+`</td>
                <td id="quantity-`+code+`">`+quantity+`</td>
                <td id="price-`+code+`">`+price+`</td>
                <td id="profit-`+code+`">`+profit+`</td>
                <td id="margen-`+code+`">`+margen.toFixed(0)+`</td>
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
        $("#profit").val('');
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
        $('#subtotalcomplete').val(parseFloat($('#subtotal').text()));
        $('#totalcomplete').val(parseFloat($('#total').text()));
        $('#ivacomplete').val(parseFloat($('#iva').text()));
        $('#guardar').prop('disabled', true);
        $('#guardar').html('<span class="spinner-border me-1" role="status" aria-hidden="true"></span> Por favor, espere...');
        $('#formQuotation').submit();
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
        url: "/cotizaciones/" + id + "/show",
        type: 'GET',
        success: function(res) {
            $('#name').text(res.customer_name);
            $('#date').text(moment(res.created_at).format('DD/MM/YYYY hh:mm A'));
            $('#closing_date').text(moment(res.closing_date).format('DD/MM/YYYY '));
            $('#closing_percentage').text(res.closing_percentage);
            $('#number_invoice').text(res.number_invoice);
            $('#totalfinal').text(numberFormat2.format(res.grand_total));
            $('#subtotal').text(numberFormat2.format(res.subtotal));
            $('#iva').text(numberFormat2.format(res.iva));
            $('#total').text(numberFormat2.format(res.grand_total));
            $('#note').text(res.note);
            if (res.file_propuesta != '') {
                $('#file').empty();
                $('#file').append('<a href="' + baseStorage + res.file_propuesta + '" target="_blank">Ver propuesta</a>');
            }
            if (res.file_propuesta == null){
                $('#file').empty();
                $('#file').append('Sin archivo');
            }


            $('#details').empty();
            res.items.forEach((value, index) => {
                $('#details')
                    .append('<tr>')
                    .append('<td>' + value.product_code + '</td>')
                    .append('<td>' + value.product_name + '</td>')
                    .append('<td>' + value.quantity + '</td>')
                    .append('<td>' + numberFormat2.format(value.price) + '</td>')
                    .append('<td>' + numberFormat2.format(value.total) + '</td>')
                    .append('</tr>');
            })

            $('#QuotesModal').modal('show');
        }
    });

}

function changeStatus(status, id) {
    $('#my-form #status').val(status);
    $('#my-form #id').val(id);

    Swal.fire({
        title: '¿Esta seguro de cambiar el estado a "' + status + '" de la Cotizacion?',
        text: "No podra cambiar el estado si es Pagado!",
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
    })
}

function addReferencia(id) {
    $('#myFormFactura #id').val(id);
    $('#myFormFactura #nro_factura').val('');
    $('#myModalFactura').modal('show');
}

$('#close').on('click', function() {
    $('#myModal').modal('hide');
    $('#name').text('');
    $('#date').text('');
    $('#totalfinal').text('');
    $('#subtotal').text('');
    $('#iva').text('');
    $('#total').text('');
    $('#note').text('');
    $('#details').empty();
});

function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar esta Cotización?',
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
                "/cotizaciones/"+id+"/delete";
        }
    })
}
