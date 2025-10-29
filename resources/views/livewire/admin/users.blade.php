<div>
    <div class="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 class="main-title m0">Users</h2>
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
                        <th>Email</th>
                        <th>Balance</th>
                        <th>Verified</th>
                        {{-- <th>Update</th> --}}
                        <th>Actions</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody class="border-0">
                    @foreach ($users as $user)
                        <tr wire:key="user-{{ $user->id }}">
                            <td>{{ $loop->iteration }}.</td>
                            <td>{{ $user->first_name }} {{ $user->last_name }}</td>
                            <td>{{ $user->email }}</td>

                            <td>&#8358;{{ number_format($user->balance, 2) }}</td>
                            {{-- <td>
                                @if ($editingUserId === $user->id)
                                    <input type="number" wire:model.defer="form.amount" class="form-control"
                                        placeholder="New Balance" />
                                    @error('form.amount')
                                        <small class="text-danger">{{ $message }}</small>
                                    @enderror
                                @else
                                    &#8358;{{ number_format($user->balance, 2) }}
                                @endif
                            </td> --}}
                            <td>
                                <span class="{{ $user->is_verified ? 'text-success' : 'text-danger' }}">
                                    {{ $user->is_verified ? 'Yes' : 'No' }}
                                </span>
                            </td>

                            {{-- <td>
                                @if ($editingUserId === $user->id)
                                    <button wire:click="saveBalance({{ $user->id }})"
                                        class="btn btn-sm btn-success">Save</button>
                                @else
                                    <button wire:click="startEdit({{ $user->id }}, {{ $user->balance }})"
                                        class="btn btn-sm btn-primary">Edit</button>
                                @endif
                            </td> --}}
                            <td>
                                @if ($editingUserId === $user->id)
                                    <button wire:click="cancelEdit" class="btn btn-sm btn-secondary">Cancel</button>
                                @else
                                    <button
                                        wire:click="updateUserStatus({{ $user->id }}, {{ $user->is_verified ? 0 : 1 }})"
                                        class="btn btn-sm {{ $user->is_verified ? 'btn-danger' : 'btn-success' }}">
                                        {{ $user->is_verified ? 'Deactivate' : 'Activate' }}
                                    </button>
                                @endif

                            </td>

                            <td>
                                @if ($user->is_verified)
                                    <a wire:navigate href="{{ route('admin.user.fund', $user->id) }}"
                                        class="btn btn-sm btn-info">
                                        Fund User
                                    </a>
                                @endif
                            </td>


                        </tr>
                    @endforeach
                </tbody>
            </table>
            {{ $users->links('pagination::bootstrap-5') }}
        </div>
    </div>
</div>
