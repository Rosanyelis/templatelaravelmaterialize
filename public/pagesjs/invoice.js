/**
 * DataTables Advanced (jquery)
 */

'use strict';
    var dt_ajax_table = $('.datatables-invoice');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    const basepath = document.querySelector('html').getAttribute('data-base-url') + "assets/images/";
    const baseStorage = document.querySelector('html').getAttribute('data-base-url');
    var producto = $('#producto');
    var totalfinal = 0;
    var totalIVA = 0;
    var datosTabla = [];
    const flatpickrDate = document.querySelector('#flatpickr-date');
$(function () {

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            serverSide: true,
            ajax: "/facturas",
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
                {data: 'n_factura', name: 'n_factura'},
                {data: 'customer.business_name', name: 'customer.business_name'},
                {data: 'motive', name: 'motive'},
                {data: 'due_date', name: 'due_date'},
                {data: 'total', name: 'total'},
                {data: 'payment_form', name: 'payment_form'},
                {data: 'status', name: 'status'},
            ],
            columnDefs: [
                {
                    targets: [0],
                    render: function (data, type, row) {
                        if (row.n_factura == null) {
                            return `
                                <button type="button" class="btn btn-info btn-sm" onclick="addInvoicefile(${row.id})"
                                    aria-expanded="false">agregar
                                </button>
                            `;
                        } else {
                            return `${row.n_factura}`;
                        }

                    }
                },
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
                        return '$ ' + numberFormat2.format(data);
                    }
                },
                {
                    targets: [5],
                    render: function (data, type, row) {
                        if (data == 'Sin Definir') {
                            return '<span class="badge bg-dark">Sin Definir</span>';
                        }

                        if (data != 'Sin Definir') {
                            return '<span class="badge bg-info"><i class="ri-money-dollar-circle-line"></i> ' + data + '</span>';

                        }
                    }
                },
                {
                    targets: [6],
                    render: function (data, type, row) {
                        if (data == 'Por Facturar') {
                            return `
                                <button type="button" class="btn btn-info btn-sm dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">Por Facturar
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 class="dropdown-header text-uppercase">cambiar Estatus a</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Facturado', ${row.id})">Facturado</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Pagado', ${row.id})">Pagado</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Cancelado', ${row.id})">Cancelado</a></li>
                                </ul>
                            `;
                        }
                        if (data == 'Facturado') {
                            return `
                                <button type="button" class="btn btn-warning btn-sm dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false">Facturado
                                </button>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <h6 class="dropdown-header text-uppercase">cambiar Estatus a</h6>
                                    </li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Pagado', ${row.id})">Pagado</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="changeStatus('Cancelado', ${row.id})">Cancelado</a></li>
                                </ul>
                            `;
                        }
                        if (data == 'Pagado') {
                            return '<span class="badge bg-success">Pagado</span>';
                        }
                        if (data == 'Vencido') {
                            return '<span class="badge bg-danger">Vencido</span>';
                        }
                        if (data == 'Cancelado') {
                            return '<span class="badge bg-dark">Cancelado</span>';
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
                let costo = parseFloat(data.cost).toFixed(0);
                $('#priceCost').val(costo);
                $('#product_name').val(data.name);
                $('#product_code').val(data.code);
            }
        });
    });

    if (flatpickrDate) {
        flatpickrDate.flatpickr({
          monthSelectorType: 'static',
        //   dateFormat: 'd-m-Y',
          locale: 'es'
        });
    }

    $('#add_product').on('click', function() {
        let code = '-';
        let producto = $('#product_name').val();
        let description = $('#description').val();
        let price = parseFloat($('#precio').val());
        let quantity = parseFloat($('#quantity').val());
        let calculo = price * quantity;
        let impuesto = ($('#impuesto_adicional').val() == '') ? 0 : parseFloat($('#impuesto_adicional').val()) / 100;
        let descuento = ($('#descuento').val() == '') ? 0 : parseFloat($('#descuento').val()) / 100;
        let valordescuento = calculo * descuento;
        let valorimpuesto = calculo * impuesto;
        let subtotal = calculo - valordescuento + valorimpuesto;
        let codigo = generarCodigoAleatorioAlfanumerico(4);


        datosTabla.push({
            'code': code,
            'codep': codigo,
            'product': producto,
            'details': description,
            'price': price,
            'quantity': quantity,
            'impuesto_adicional': valorimpuesto.toFixed(0),
            'descuento': valordescuento.toFixed(0),
            'subtotal': subtotal.toFixed(0)
        });

        $("#table_products tbody").append(
            `<tr id="row-`+codigo+`">
                <td>`+producto+`</td>
                <td>`+description+`</td>
                <td>`+quantity+`</td>
                <td>`+price+`</td>
                <td>`+valorimpuesto.toFixed(0)+`</td>
                <td>`+valordescuento.toFixed(0)+`</td>
                <td>`+subtotal.toFixed(0)+`</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm"
                        id="delete_product" data-code="`+codigo+`">
                        <i class="ri-delete-bin-fill"></i>
                    </button>
                </td>
            </tr>`);

        calcular();

        $("#product_name").val("");
        $("#description").val('');
        $("#quantity").val('');
        $("#details").val('');
        $('#precio').val('');
        $('#impuesto_adicional').val('');
        $('#descuento').val('');

    });

    $('#table_products tbody').on('click', '#delete_product', function() {
        let product = $(this).data('code');
        let id = "#row-" + product;

        datosTabla = datosTabla.filter(function(item) {
            return item.codep !== product;
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
        $('#subtotalcomplete').val(parseFloat($('#monto_neto').text()));
        $('#totalcomplete').val(parseFloat($('#total').text()));
        $('#ivacomplete').val(parseFloat($('#iva').text()));
        $('#impuestocomplete').val(parseFloat($('#impuesto_adicional').text()));
        $('#guardar').prop('disabled', true);
        $('#guardar').html('<span class="spinner-border me-1" role="status" aria-hidden="true"></span> Por favor, espere...');
        $('#formInvoice').submit();
    });

});


function calcular() {
    var totalfinal = 0;
    var totalIVA = 0;
    var total = 0;
    var totalImpuesto = 0;
    for (let i = 0; i < datosTabla.length; i++) {
        totalfinal += parseInt(datosTabla[i].subtotal);
        totalImpuesto += parseInt(datosTabla[i].impuesto_adicional);
    }
    totalIVA = parseFloat(totalfinal) * 0.19;
    total = totalfinal + totalIVA + totalImpuesto;
    $("#monto_neto").empty();
    $("#monto_neto").text(parseFloat(totalfinal).toFixed(0));
    $("#iva").empty();
    $("#iva").text(totalIVA.toFixed(0));
    $("#total").empty();
    $("#total").text(total.toFixed(0));
    $("#impuesto_adicional").empty();
    $("#impuesto_adicional").text(totalImpuesto.toFixed(0));
}

function addInvoicefile(id) {
    $('#my-form-invoice #id').val(id);
    // abrimos modal InvoicesModal
    $('#InvoicesModal').modal('show');
}

function updatePayment(id) {
    $('#my-form-invoice-payment #id').val(id);
    // abrimos modal InvoicesModal
    $('#InvoicesPaymentModal').modal('show');
}

function changeStatus(status, id) {
    $('#my-form #status').val(status);
    $('#my-form #id').val(id);

    Swal.fire({
        title: '¿Esta seguro de cambiar el estado a "' + status + '" de la Factura?',
        text: "No podra cambiar el estado si es Cancelado o Pagado!",
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

function addNumberInvoice() {
    $('#my-form-invoice #invoice_number').val();
}

function generarCodigoAleatorioAlfanumerico(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < longitud;  
   i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }
