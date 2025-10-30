<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 class="main-title m0">All Transactions</h2>
        <div class="short-filter d-flex align-items-center ms-auto xs-mt-30">
            <input type="text" wire:model.debounce.500ms="search" class="form-control"
                placeholder="Search by name or email" />
        </div>
    </div>

    <div class="bg-white card-box border-20">
        <div class="table-responsive">
            <table class="table job-alert-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody class="border-0">
                    @foreach ($payments as $payment)
                        <tr wire:key="user-{{ $payment->id }}">
                            <td>{{ $loop->iteration }}.</td>
                            <td>{{ $payment->user->first_name ?? '' }} {{ $payment->user->last_name ?? '' }}</td>
                            <td>&#8358;{{ number_format($payment->amount) }}</td>

                            <td>&#8358;{{ number_format($payment->user->balance ?? 0.0) }}</td>

                            <td>
                                {{ $payment->description }}
                            </td>

                            <td>
                                {{ $payment->naration }}
                            </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>
            {{ $payments->links('pagination::bootstrap-5') }}
        </div>
    </div>
</div>
