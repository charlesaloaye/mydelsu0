<div>
    <div class="container my-5">
        <div class="row">
            <div class="col-md-10 offset-md-1">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="card-title text-center mb-0">myDELSU CGPA Calculator</h4>
                    </div>

                    <div class="card-body">
                        <!-- Flash Messages -->
                        @if (session()->has('message'))
                            <div class="alert alert-{{ session('type', 'info') }} alert-dismissible fade show"
                                role="alert">
                                {{ session('message') }}
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        @endif

                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="card-title">Welcome to myDELSU CGPA Calculator</h5>
                                <p class="text-muted">Add your courses to calculate your GPA and CGPA</p>
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-primary" wire:click="openAddModal">
                                    <i class="bi bi-plus-circle"></i> Add Course
                                </button>
                            </div>
                        </div>

                        <hr class="border-success border-2">

                        <!-- Course Tables -->
                        <div id="courseTables">
                            @if ($courses->isEmpty())
                                <div class="text-center text-muted">
                                    <h4>No courses added yet. Click "Add Course" to get started.</h4>
                                </div>
                            @else
                                @foreach ($coursesByLevel as $level => $levelCourses)
                                    <h3 class="text-primary">{{ $level }} Level</h3>

                                    @php
                                        $levelStats = $this->getLevelStats($levelCourses);
                                        $firstSemesterCourses = $levelCourses->where('semester', 1);
                                        $secondSemesterCourses = $levelCourses->where('semester', 2);
                                    @endphp

                                    <!-- First Semester -->
                                    <h4 class="text-secondary">First Semester</h4>
                                    @if ($firstSemesterCourses->isEmpty())
                                        <div class="alert alert-info">No courses added for this semester.</div>
                                    @else
                                        @php $firstSemStats = $this->getSemesterStats($firstSemesterCourses); @endphp
                                        <table class="table table-bordered table-striped">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Credit</th>
                                                    <th>Score</th>
                                                    <th>Grade</th>
                                                    <th>Points</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($firstSemesterCourses as $course)
                                                    <tr>
                                                        <td>{{ $course->course_code }}</td>
                                                        <td>{{ $course->credit_unit }}</td>
                                                        <td>{{ $course->score }}</td>
                                                        <td>{{ $course->grade }}</td>
                                                        <td>{{ $course->points }}</td>
                                                        <td>
                                                            <button class="btn btn-warning btn-sm"
                                                                wire:click="editCourse({{ $course->id }})">
                                                                Update
                                                            </button>
                                                            <button class="btn btn-danger btn-sm ms-1"
                                                                wire:click="confirmDelete({{ $course->id }})">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                            <tfoot>
                                                <tr class="table-info">
                                                    <td><b>Total Credits:</b> {{ $firstSemStats['totalCredits'] }}</td>
                                                    <td><b>Total Points:</b> {{ $firstSemStats['totalPoints'] }}</td>
                                                    <td colspan="4"><b>GPA:</b> {{ $firstSemStats['gpa'] }}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    @endif

                                    <!-- Second Semester -->
                                    <h4 class="text-secondary">Second Semester</h4>
                                    @if ($secondSemesterCourses->isEmpty())
                                        <div class="alert alert-info">No courses added for this semester.</div>
                                    @else
                                        @php $secondSemStats = $this->getSemesterStats($secondSemesterCourses); @endphp
                                        <table class="table table-bordered table-striped">
                                            <thead class="table-dark">
                                                <tr>
                                                    <th>Course</th>
                                                    <th>Credit</th>
                                                    <th>Score</th>
                                                    <th>Grade</th>
                                                    <th>Points</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($secondSemesterCourses as $course)
                                                    <tr>
                                                        <td>{{ $course->course_code }}</td>
                                                        <td>{{ $course->credit_unit }}</td>
                                                        <td>{{ $course->score }}</td>
                                                        <td>{{ $course->grade }}</td>
                                                        <td>{{ $course->points }}</td>
                                                        <td>
                                                            <button class="btn btn-warning btn-sm"
                                                                wire:click="editCourse({{ $course->id }})">
                                                                Update
                                                            </button>
                                                            <button class="btn btn-danger btn-sm ms-1"
                                                                wire:click="confirmDelete({{ $course->id }})">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                            <tfoot>
                                                <tr class="table-info">
                                                    <td><b>Total Credits:</b> {{ $secondSemStats['totalCredits'] }}
                                                    </td>
                                                    <td><b>Total Points:</b> {{ $secondSemStats['totalPoints'] }}</td>
                                                    <td colspan="4"><b>GPA:</b> {{ $secondSemStats['gpa'] }}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    @endif

                                    <!-- Level CGPA Display -->
                                    <div class="mb-4">
                                        <h4>{{ $level }} Level CGPA: <span
                                                class="text-success">{{ $levelStats['cgpa'] }}</span></h4>
                                        <hr class="border-danger border-2">
                                    </div>
                                @endforeach

                                <!-- Overall CGPA Display -->
                                <div class="mt-4">
                                    <hr class="border-danger border-2">
                                    <div class="text-center">
                                        <h2 class="text-success">
                                            Overall Cumulative Grade Point Average (CGPA):
                                            <span>{{ $overallStats['cgpa'] }}</span>
                                        </h2>
                                    </div>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Course Modal -->
    @if ($showAddModal)
        <div class="modal fade show" style="display: block;" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Course</h5>
                        <button type="button" class="btn-close" wire:click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form wire:submit="addCourse">
                            <div class="mb-3">
                                <label for="level" class="form-label">Level</label>
                                <select class="form-select" wire:model="level" required>
                                    <option value="">-- Select Level --</option>
                                    <option value="100">100</option>
                                    <option value="200">200</option>
                                    <option value="300">300</option>
                                    <option value="400">400</option>
                                    <option value="500">500</option>
                                </select>
                                @error('level')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="course_code" class="form-label">Course Code</label>
                                <input type="text" class="form-control" wire:model="course_code"
                                    placeholder="e.g., CSC101" required>
                                @error('course_code')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="credit_unit" class="form-label">Course Credit Unit</label>
                                <input type="number" class="form-control" wire:model="credit_unit"
                                    placeholder="e.g., 3" min="1" max="6" required>
                                @error('credit_unit')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="semester" class="form-label">Course Semester</label>
                                <select class="form-select" wire:model="semester" required>
                                    <option value="1">First Semester</option>
                                    <option value="2">Second Semester</option>
                                </select>
                                @error('semester')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="score" class="form-label">Course Score</label>
                                <input type="number" class="form-control" wire:model="score" min="0"
                                    max="100" required>
                                @error('score')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btn-secondary"
                                    wire:click="closeModal">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    @endif

    <!-- Edit Course Modal -->
    @if ($showEditModal)
        <div class="modal fade show" style="display: block;" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Course</h5>
                        <button type="button" class="btn-close" wire:click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form wire:submit="updateCourse">
                            <div class="mb-3">
                                <label for="edit_course_code" class="form-label">Course Code</label>
                                <input type="text" class="form-control" wire:model="edit_course_code" required>
                                @error('edit_course_code')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="edit_credit_unit" class="form-label">Course Credit Unit</label>
                                <input type="number" class="form-control" wire:model="edit_credit_unit"
                                    min="1" max="6" required>
                                @error('edit_credit_unit')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="mb-3">
                                <label for="edit_score" class="form-label">Course Score</label>
                                <input type="number" class="form-control" wire:model="edit_score" min="0"
                                    max="100" required>
                                @error('edit_score')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btn-secondary"
                                    wire:click="closeModal">Cancel</button>
                                <button type="submit" class="btn btn-primary">Update Course</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    @endif

    <!-- Delete Course Modal -->
    @if ($showDeleteModal)
        <div class="modal fade show" style="display: block;" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Delete Course</h5>
                        <button type="button" class="btn-close" wire:click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <h4>Are you sure you want to delete this course?</h4>
                        @if ($courseToDelete)
                            <p><strong>Course:</strong> {{ $courseToDelete->course_code }}</p>
                            <p><strong>Credit Unit:</strong> {{ $courseToDelete->credit_unit }}</p>
                            <p><strong>Score:</strong> {{ $courseToDelete->score }}</p>
                        @endif

                        <div class="mt-3 d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" wire:click="closeModal">Cancel</button>
                            <button type="button" class="btn btn-danger" wire:click="deleteCourse">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    @endif
</div>
