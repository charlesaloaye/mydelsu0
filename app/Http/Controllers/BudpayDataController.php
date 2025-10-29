<?php

namespace App\Http\Controllers;

use App\Services\BudpayDataService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class BudpayDataController extends Controller
{
    public function getPlans(BudpayDataService $budpay, Request $request)
    {
        return $budpay->getPlans($request->provider);
    }
}
