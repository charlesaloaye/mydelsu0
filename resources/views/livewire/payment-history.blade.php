<div class="card mt-4">
    <div class="card-header">Payment History</div>
    <div class="card-body table-responsive">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Reference</th>
                    <th>Amount (₦)</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($payments as $payment)
                    <tr>
                        <td>{{ $payment->type }}</td>
                        <td>₦{{ number_format($payment->amount / 100) }}</td>
                        <td>{{ ucfirst($payment->status) }}</td>
                        <td>{{ $payment->created_at->format('d M, Y h:i A') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4">No payments found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        {{-- {{ $payments->links() }} --}}
    </div>
</div>
