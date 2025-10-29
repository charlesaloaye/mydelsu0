<aside class="dash-aside-navbar">
    <div class="position-relative">
        <div class="logo text-md-center d-md-block d-flex align-items-center justify-content-between">
            <a href="#">
                <img class="lazy-img" src="{{ config('app.logo') }}" alt="{{ config('app.name') }}" class="img-fluid">
            </a>
            <button class="close-btn d-block d-md-none"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="user-data">
            <div class="user-avatar online position-relative rounded-circle">
                <img src="{{ config('app.user_icon') }}"
                    alt="{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}" class="lazy-img">
            </div>
            <!-- /.user-avatar -->
            <div class="user-name-data">
                <button class="user-name dropdown-toggle" type="button" id="profile-dropdown" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false">
                    {{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="profile-dropdown">
                    <li>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <x-icon name="user" />
                            <span class="ms-2 ps-1">Profile</span>
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <x-icon name="cog" />
                            <span class="ms-2 ps-1">System Settings</span></a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- /.user-data -->
        <nav class="dasboard-main-nav">
            <ul class="style-none">
                <li><a wire:navigate href="{{ route('admin.dashboard') }}"
                        class="d-flex w-100 align-items-center active">
                        <x-icon name="home" />

                        <span>Dashboard</span>
                    </a></li>
                <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="user" />

                        <span>My Profile</span>
                    </a></li>

                <li><a wire:navigate href="{{ route('admin.users.transactions') }}"
                        class="d-flex w-100 align-items-center">
                        <x-icon name="user" />

                        <span>Transactions</span>
                    </a></li>

                <li><a wire:navigate href="{{ route('admin.users') }}" class="d-flex w-100 align-items-center">
                        <x-icon name="users" />
                        <span>Users</span>
                    </a></li>

                <li><a wire:navigate href="{{ route('admin.approvals') }}" class="d-flex w-100 align-items-center">
                        <x-icon name="trophy" />
                        <span>Contests</span>
                    </a></li>

                <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="message" />
                        <span>Messages</span>
                    </a></li>
                <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="bookmark" />
                        <span>Quiz</span>
                    </a></li>
                {{-- <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="lightbulb" />
                        <span>Sportlight</span>
                    </a></li> --}}
                {{-- <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="calendar" />
                        <span>Events</span>
                    </a></li> --}}
                {{-- <li><a href="#" class="d-flex w-100 align-items-center">
                        <x-icon name="product-hunt
                        fa-brands" />
                        <span>Products</span>
                    </a>
                </li> --}}
            </ul>
        </nav>
        {{-- <div class="profile-complete-status">
            <div class="progress-value fw-500">87%</div>
            <div class="progress-line position-relative">
                <div class="inner-line" style="width:80%;"></div>
            </div>
            <p>Profile Complete</p>
        </div> --}}

        <a href="{{ route('admin.logout') }}" class="d-flex w-100 align-items-center logout-btn">
            <x-icon name="sign-out-alt" />
            <span>Logout</span>
        </a>
    </div>
</aside>
