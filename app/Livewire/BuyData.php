<?php

namespace App\Livewire;

use Livewire\Component;
use App\Livewire\Forms\BuyServiceForm;
use App\Services\MaskawaService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Livewire\Attributes\Title;

#[Title('Buy Data')]
class BuyData extends Component
{
    public BuyServiceForm $form;

    public function mount()
    {
        $this->form->networks = config('dataplans.networks');
    }

    public function updatedFormNetworkId()
    {
        $this->form->plans = config('dataplans.plans')[$this->form->networkId] ?? [];
        $this->form->planId = null;
    }

    protected function getSelectedPlan()
    {
        $selectedPlan = collect($this->form->plans)
            ->firstWhere('id', $this->form->planId);

        if (!$selectedPlan) {
            throw new \Exception("Selected plan not found in available plans");
        }

        // Ensure the plan has all required fields
        return [
            'id' => $selectedPlan['id'],
            'name' => $selectedPlan['plan_type'] ?? 'Unknown Plan',
            'amount' => (float) ($selectedPlan['price'] ?? 0), // Convert price to amount
            'validity' => $selectedPlan['validity'] ?? 'N/A',
            'size' => $selectedPlan['size'] ?? 'N/A',
            'network' => $selectedPlan['network'] ?? 'Unknown'
        ];
    }

    public function buyDataButton(MaskawaService $service)
    {
        $this->form->validate();

        DB::beginTransaction();

        try {
            $user = Auth::user();
            $user->refresh();

            $plan = $this->getSelectedPlan();

            // Convert amount to float for accurate comparison
            $planAmount = (float) $plan['amount'];
            $userBalance = (float) $user->balance;

            if ($userBalance < $planAmount) {
                $this->form->status = 'error';
                $this->form->message = 'Insufficient balance.';
                session()->flash($this->form->status, $this->form->message);
                return;
            }

            $response = $service->buyData(
                $this->form->networkId,
                $this->form->mobileNumber,
                $this->form->planId
            );

            // Log::info('Buy Data API Response', [
            //     'user_id' => $user->id,
            //     'plan' => $plan,
            //     'response' => $response
            // ]);

            if ($this->isSuccessfulResponse($response)) {
                $user->decrement('balance', $planAmount);

                $user->transactions()->create([
                    'type' => 'debit',
                    'amount' => $planAmount,
                    'status' => 'completed',
                    'description' => 'Data Purchase - ' . $plan['name'],
                    'gateway_response' => json_encode([
                        'message' => 'Data purchase successful',
                        'plan_details' => $plan,
                        'api_response' => $response['data'] ?? $response
                    ]),
                ]);

                $this->form->status = 'success';
                $this->form->message = 'Data purchase successful for ' .
                    ($response['data']['mobile_number'] ?? $this->form->mobileNumber);

                session()->flash($this->form->status, $this->form->message);
                DB::commit();

                return redirect()->route('dashboard.index');
            }

            throw new \Exception($this->getErrorMessage($response));
        } catch (\Exception $e) {
            DB::rollBack();
            // Log::error('Data Purchase Error', [
            //     'error' => $e->getMessage(),
            //     'user_id' => Auth::id(),
            //     'plan_id' => $this->form->planId
            // ]);

            $this->form->status = 'error';
            $this->form->message = $e->getMessage();
            session()->flash($this->form->status, $this->form->message);
        }
    }

    protected function isSuccessfulResponse($response)
    {
        // Check multiple success indicators
        $status = strtolower($response['data']['Status'] ?? $response['status'] ?? '');

        return $status === 'successful' ||
            ($response['status'] ?? false) === true ||
            in_array($response['http_status'] ?? null, [200, 201]) ||
            ($response['success'] ?? false) === true;
    }

    protected function getErrorMessage($response)
    {
        return $response['data']['message'] ??
            $response['data']['Status'] ??
            $response['message'] ??
            $response['error'] ??
            'Transaction failed. Please try again.';
    }

    protected function handleFailedTransaction($user, $response, $errorMessage)
    {
        $this->form->status = 'error';
        $this->form->message = $errorMessage;
        session()->flash($this->form->status, $this->form->message);

        if ($user) {
            $plan = $this->getSelectedPlan();
            $amount = $plan['amount'] ?? 0; // Default to 0 if amount doesn't exist

            $user->transactions()->create([
                'type' => 'debit',
                'amount' => $amount,
                'status' => 'failed',
                'description' => 'Failed Data Purchase - ' . ($plan['name'] ?? 'Unknown Plan'),
                'gateway_response' => json_encode($response ?? ['error' => $errorMessage]),
            ]);
        }
    }
}
