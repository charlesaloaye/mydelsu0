<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h2 class="main-title m-0">Referral Contests</h2>
        <div class="short-filter d-flex align-items-center ms-auto">
            <input type="text" wire:model.debounce.500ms="search" class="form-control"
                placeholder="Search by name or email" />
        </div>
    </div>

    {{-- @if (session()->has('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif --}}

    <div class="bg-white card-box border-20">
        <div class="table-responsive">
            <table class="table job-alert-table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Referrer</th>
                        <th>Balance</th>
                        <th>Verified</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $user)
                        <tr wire:key="user-{{ $user->id }}-{{ $user->is_verified }}">

                            <td>{{ $loop->iteration }}.</td>
                            <td>{{ $user->first_name }} {{ $user->last_name }}</td>
                            <td>{{ $user->email }}</td>
                            <td>
                                @if ($user->referrer)
                                    {{ $user->referrer->first_name }} {{ $user->referrer->last_name }}
                                @else
                                    N/A
                                @endif
                            </td>
                            <td>&#8358;{{ number_format($user->balance, 2) }}</td>
                            <td>
                                <span class="{{ $user->is_verified ? 'text-success' : 'text-danger' }}">
                                    {{ $user->is_verified ? 'Yes' : 'No' }}
                                </span>
                            </td>
                            <td>
                                <button
                                    wire:click="updateUserStatus({{ $user->id }}, {{ $user->is_verified ? 0 : 1 }})"
                                    class="btn btn-sm {{ $user->is_verified ? 'btn-danger' : 'btn-success' }}">
                                    {{ $user->is_verified ? 'Deactivate' : 'Activate' }}
                                </button>
                            </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>
            {{ $users->links() }}
        </div>
    </div>

    <!-- Confetti JS -->
    {{-- <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        Livewire.on('userApproved', () => {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: {
                    y: 0.6
                }
            });
        });
    </script> --}}
</div>
