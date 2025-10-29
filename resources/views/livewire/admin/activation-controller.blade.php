<!-- resources/views/livewire/admin/approval.blade.php -->

<div>
    <h2 class="text-2xl font-bold mb-4">Pending User Approvals</h2>

    @if (session()->has('success'))
        <div class="bg-green-100 text-green-800 p-3 mb-4 rounded">
            {{ session('success') }}
        </div>
    @endif

    @if ($users->isEmpty())
        <p class="text-gray-500">No users pending approval.</p>
    @else
        <table class="min-w-full bg-white border">
            <thead>
                <tr class="bg-gray-100">
                    <th class="px-4 py-2 border">Name</th>
                    <th class="px-4 py-2 border">Email</th>
                    <th class="px-4 py-2 border">Phone</th>
                    <th class="px-4 py-2 border">Referrer</th>
                    <th class="px-4 py-2 border">Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($users as $user)
                    <tr>
                        <td class="px-4 py-2 border">{{ $user->first_name }} {{ $user->last_name }}</td>
                        <td class="px-4 py-2 border">{{ $user->email }}</td>
                        <td class="px-4 py-2 border">{{ $user->phone }}</td>
                        <td class="px-4 py-2 border">{{ $user->referrer?->first_name ?? '-' }}</td>
                        <td class="px-4 py-2 border">
                            <button wire:click="approve({{ $user->id }})"
                                class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                                Approve
                            </button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>

<!-- Confetti JS -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<script>
    window.addEventListener('confetti', event => {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: {
                y: 0.6
            }
        });
    });
</script>
