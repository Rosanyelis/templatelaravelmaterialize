/**
 * DataTables Advanced (jquery)
 */

'use strict';


(async function () {
    const baseStorage = document.querySelector('html').getAttribute('data-base-url');
    const numberFormat2 = new Intl.NumberFormat('de-DE');
    function salesThisMonth() {
        fetch(baseStorage + '/sales-overview')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#salesmonth').innerHTML = '$ ' + numberFormat2.format(data.sales);
                document.querySelector('#invoicesmonth').innerHTML = '$ ' + numberFormat2.format(data.invoices);
                document.querySelector('#quotemonth').innerHTML = '$ ' + numberFormat2.format(data.quotations);

            });
    }

    function servicesDue() {
        document.querySelector('#table-services-due-body').innerHTML = '';
        fetch(baseStorage + '/services-due')
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    // limpiamos la tabla antes de cargar datos

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${element.customer.business_name}</td>
                        <td>${moment(element.end_date).format('DD/MM/YYYY')}</td>
                        <td>$ ${ numberFormat2.format(element.grand_total) }</td>
                        <td>${element.type_contract}</td>
                    `;
                    document.querySelector('#table-services-due-body').appendChild(row);
                });

            });
    }

    function contractsType() {
        fetch(baseStorage + '/quantity-contract')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#hosting').innerHTML = numberFormat2.format(data.hosting);
                document.querySelector('#support').innerHTML = numberFormat2.format(data.soporte);
                document.querySelector('#web').innerHTML = numberFormat2.format(data.desarrollo);
                document.querySelector('#social').innerHTML = numberFormat2.format(data.redes);
                document.querySelector('#totalContractType').innerHTML = numberFormat2.format(data.total);
            });
    }

    function hostingType() {
        fetch(baseStorage + '/quantity-hosting')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#typeHosting').innerHTML = numberFormat2.format(data.hosting);
                document.querySelector('#typeTienda').innerHTML = numberFormat2.format(data.vps);
                document.querySelector('#typeVPS').innerHTML = numberFormat2.format(data.tiendas);
                document.querySelector('#typeHostingTotal').innerHTML = numberFormat2.format(data.total);
            });
    }

    function salesYears() {
        fetch(baseStorage + '/sales-years')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#salesyear').innerHTML = '$ ' + numberFormat2.format(data.sales_year);
            });
    }

    function purchaseMonth() {
        fetch(baseStorage + '/purchase-month')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#purchasesMonth').innerHTML = '$ ' + numberFormat2.format(data.purchases);
            });
    }

    function expenseMonth() {
        fetch(baseStorage + '/expenses-month')
            .then(response => response.json())
            .then(data => {
                document.querySelector('#expensesMonth').innerHTML = '$ ' + numberFormat2.format(data.expenses);
            });
    }

    function InvoicesQty() {
        fetch(baseStorage + '/invoices-pending-month')
            .then(response => response.json())
            .then(data => {
                console.log(data);

                document.querySelector('#invoicesqty').innerHTML = '$ ' + numberFormat2.format(data.invoices_pendind);
                document.querySelector('#qtyinvoices').innerHTML = numberFormat2.format(data.countInvoices);

            });
    }

    salesThisMonth();
    servicesDue();
    contractsType();
    hostingType();
    salesYears();
    purchaseMonth();
    expenseMonth();
    InvoicesQty();

    setInterval(() => {
        salesThisMonth();
        servicesDue();
        contractsType();
        hostingType();
        salesYears();
        purchaseMonth();
        expenseMonth();
        InvoicesQty();
    }, 60000);
})();
