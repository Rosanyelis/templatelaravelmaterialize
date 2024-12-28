/**
 * DataTables Advanced (jquery)
 */

'use strict';

    var dt_ajax_table = $('.datatables-purchase-orders');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    var producto = $('#producto');
    const basepath = "http://tigroup.test/assets/images/";
    const baseStorage = "http://tigroup.test/";
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
                url: "/ordenes-de-compra/datatable",
                data: function(d) {
                    d.start = $('#startday').val();
                    d.end = $('#endday').val();
                    d.supplier_id = $('#proveedor').val();
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
                    data: 'correlativo',
                    name: 'correlativo'
                },
                {
                    data: 'supplier',
                    name: 'supplier'
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
            }]
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

    $('#clearFilter').on('click', function() {
        $('#startday').val('');
        $('#endday').val('');
        $('#proveedor').val('').trigger('change');
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
        url: "/ordenes-de-compra/" + id + "/show",
        type: 'GET',
        success: function(res) {
            console.log(res);

            $('#name').text(res.supplier.name);
            $('#date').text(moment(res.created_at).format('DD/MM/YYYY hh:mm A'));
            $('#total').text(numberFormat2.format(res.total));
            $('#note').text(res.note);
            $('#total2').text(numberFormat2.format(res.total));

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

            $('#PurchaseOrdersModal').modal('show');
        }
    });

}


$('#close').on('click', function() {
    $('#myModal').modal('hide');
    $('#name').text('');
    $('#date').text('');
    $('#total').text('');
    $('#note').text('');
    $('#total2').text('');
    $('#details').empty();
});

function deleteRecord(id) {
    Swal.fire({
        title: '¿Está seguro de eliminar esta Orden de Compra?',
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
                "/ordenes-de-compra/"+id+"/delete";
        }
    })
}
