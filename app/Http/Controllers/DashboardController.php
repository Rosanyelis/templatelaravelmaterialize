<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Quotation;
use App\Models\WorkOrder;
use Illuminate\Http\Request;
use App\Models\ProductStoreQty;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $mes = Carbon::now()->format('m');
        $totalMes = Sale::wheremonth('created_at', $mes)->sum('grand_total');
        $totalProductos = DB::table('products')
                            ->join('product_store_qties', 'products.id', '=', 'product_store_qties.product_id')
                            ->where('type', '!=', 'SERVICIOS')
                            ->select(DB::raw('SUM(product_store_qties.quantity) as total_products'))
                            ->first()
                            ->total_products;

        $totalMontoProductos = DB::table('products')
                                ->join('product_store_qties', 'products.id', '=', 'product_store_qties.product_id')
                                ->where('type', '!=', 'SERVICIOS')
                                ->select(DB::raw('SUM(products.cost * product_store_qties.quantity) as total'))
                                ->first()
                                ->total;
        $totalQuote = Quotation::whereMonth('created_at', $mes)->count();
        $totalMontoQuote = Quotation::whereMonth('created_at', $mes)->sum('grand_total');
        $totalot = WorkOrder::whereMonth('created_at', $mes)->count();
        $totalMontoot = WorkOrder::whereMonth('created_at', $mes)->sum('total');
        $totalAcumuladasventas = Sale::sum('grand_total');
        $totalxdia = $this->totalSales();
        $totalservices = $this->totalServices();
        $topservices = $this->topServices();
        $totalventasanuales = $this->totalSalesYear();
        $compras = $this->totalPurchase();
        $statuWorkorders = $this->workordersStatus();

        return view('dashboard', compact('totalMes', 'totalProductos', 'totalMontoProductos',
            'totalxdia', 'totalQuote', 'totalMontoQuote', 'totalAcumuladasventas', 'totalot', 'totalMontoot',
            'totalservices', 'topservices', 'compras', 'totalventasanuales', 'statuWorkorders'));
    }

    public function totalSales()
    {
        $data = Sale::wheredate('created_at', Carbon::today())->get();
        $totalefectivo = 0;
        $totalcredito = 0;
        $totalcheque = 0;
        $totaltransferencia = 0;
        foreach ($data as $sale) {
            $payments = DB::table('sales')
                ->join('sale_payments', 'sales.id', '=', 'sale_payments.sale_id')
                ->select(DB::raw('SUM(sale_payments.pos_paid) AS total'), 'sale_payments.payment_method')
                ->groupBy('sale_payments.payment_method')
                ->where('sales.id', $sale->id)
                ->get();

            foreach ($payments as $key) {
                if ($key->payment_method == 'Efectivo') {
                    $totalefectivo = $key->total;
                } else if ($key->payment_method == 'Tarjeta de credito') {
                    $totalcredito = $key->total;
                } else if ($key->payment_method == 'Cheque') {
                    $totalcheque = $key->total;
                } else if ($key->payment_method == 'Transferencia') {
                    $totaltransferencia = $key->total;
                }
            }
        }

        $informe = [
            'totalefectivo' => $totalefectivo,
            'totalcredito' => $totalcredito,
            'totalcheque' => $totalcheque,
            'totaltransferencia' => $totaltransferencia
        ];
        return $informe;
    }

    public function totalservices()
    {
        $today = Carbon::today()->toDateString();

        $servicesTotal = DB::table('sales')
            ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(DB::raw('SUM(sale_items.subtotal) AS total'))
            ->whereDate('sales.created_at', $today)
            ->where('products.type', 'SERVICIOS')
            ->first()
            ->total;

        $otherProductsTotal = DB::table('sales')
        ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
        ->join('products', 'sale_items.product_id', '=', 'products.id')
        ->where('products.type', '!=', 'SERVICIOS')
        ->whereDate('sales.created_at', $today)
        ->select(DB::raw('SUM(sale_items.subtotal) AS total'))
        ->first()
        ->total;

        $servicesTotal = $servicesTotal ? $servicesTotal : 0;
        $otherProductsTotal = $otherProductsTotal ? $otherProductsTotal : 0;

        $data = [
            'servicesTotal' => $servicesTotal,
            'otherProductsTotal' => $otherProductsTotal
        ];
        return $data;
    }

    public function topServices()
    {
        $services = DB::table('sales')
                ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
                ->join('products', 'sale_items.product_id', '=', 'products.id')
                ->where('products.type', 'SERVICIOS')
                ->whereDate('sales.created_at', Carbon::today())
                ->select(DB::raw('SUM(sale_items.subtotal) AS total'), 'products.name')
                ->groupBy('products.name')
                ->orderBy('total', 'desc')
                ->get();
        return $services;
    }

    public function totalSalesYear()
    {
        $year = Carbon::today()->year;
        $mes = Carbon::today()->month;

        // Obtener los datos de ventas por mes
        $data = Sale::select(
            DB::raw('EXTRACT(MONTH FROM created_at) AS MONTH'),
            DB::raw('SUM(grand_total) AS total')
        )
        ->whereYear('created_at', $year)
        ->whereMonth('created_at', '<=', $mes)
        ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
        ->get();

        // Crear un arreglo con todos los meses del año
        $months = range(1, 12);

        // Crear un arreglo de objetos con los datos de ventas, rellenando con ceros los meses faltantes
        $result = [];
        foreach ($months as $month) {
            $found = $data->where('MONTH', $month)->first();
            $dato = $found ? $found->total : 0; // $found ? intval($found->total) : 0;

            array_push($result, $dato);
        }

        // Convertir el arreglo a una cadena
        $salesString = implode(',', $result);

        return $salesString;
    }

    public function totalPurchase()
    {
        $mes = Carbon::today()->month;

        // Obtener los datos de compras por mes
        $data = Purchase::join('suppliers', 'purchases.supplier_id', '=', 'suppliers.id')
            ->select('purchases.created_at', 'purchases.total', 'suppliers.name')
            ->whereMonth('purchases.created_at', $mes)
            ->orderBy('purchases.created_at', 'desc')
            ->get();

        return $data;
    }

    public function workordersStatus()
    {
        $statusPendiente = Workorder::where('status', 'Pendiente')->count();
        $statusEnProceso = Workorder::where('status', 'En Proceso')->count();
        $statusCompletado = Workorder::where('status', 'Completado')->count();
        $statusCancelado = Workorder::where('status', 'Cancelado')->count();

        $status = [
            'Pendiente' => $statusPendiente,
            'EnProceso' => $statusEnProceso,
            'Completado' => $statusCompletado,
            'Cancelado' => $statusCancelado
        ];



        return $status;
    }
}
