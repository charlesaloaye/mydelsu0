<div>
    <!-- Single root div wrapper for Livewire -->    
     @include('components.home.home-header')
<div>
    <div class="container my-5">
        <div class="row">
            <div class="col-md-10 offset-md-1">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="card-title text-center mb-0">myDELSU CGPA Calculator</h4>
                    </div>

                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h5 class="card-title">Welcome to myDELSU CGPA Calculator</h5>
                                <p class="text-muted">Add your courses to calculate your GPA and CGPA</p>
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addCourseModal">
                                    <i class="bi bi-plus-circle"></i> Add Course
                                </button>
                                <!-- <button class="btn btn-success ms-2" onclick="exportData()">
                                        <i class="bi bi-download"></i> Export Data
                                    </button>
                                    <button class="btn btn-warning ms-2" onclick="importData()">
                                        <i class="bi bi-upload"></i> Import Data
                                    </button> -->
                                <input type="file" id="importFile" accept=".json" style="display: none;"
                                    onchange="handleImport(event)">
                            </div>
                        </div>

                        <hr class="border-success border-2">

                        <!-- Course Tables will be dynamically generated here -->
                        <div id="courseTables"></div>

                        <!-- Overall CGPA Display -->
                        <div id="overallCGPA" class="mt-4" style="display: none;">
                            <hr class="border-danger border-2">
                            <div class="text-center">
                                <h2 class="text-success">
                                    Overall Cumulative Grade Point Average (CGPA):
                                    <span id="cgpaValue">0.00</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Course Modal -->
    <div class="modal fade" id="addCourseModal" tabindex="-1" aria-labelledby="addCourseModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCourseModalLabel">Add New Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addCourseForm">
                        <div class="mb-3">
                            <label for="level" class="form-label">Level</label>
                            <select class="form-select" id="level" name="level" required>
                                <option value="">-- Select Level --</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="300">300</option>
                                <option value="400">400</option>
                                <option value="500">500</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="course_name" class="form-label">Course Code</label>
                            <input type="text" class="form-control" id="course_name" name="course_name"
                                placeholder="e.g., CSC101" required>
                        </div>
                        <div class="mb-3">
                            <label for="course_credit" class="form-label">Course Credit Unit</label>
                            <input type="number" class="form-control" id="course_credit" name="course_credit"
                                placeholder="e.g., 3" min="1" max="6" required>
                        </div>
                        <div class="mb-3">
                            <label for="course_semester" class="form-label">Course Semester</label>
                            <select class="form-select" id="course_semester" name="course_semester" required>
                                <option value="1">First Semester</option>
                                <option value="2">Second Semester</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <div class="mb-3">
                                <label for="course_score" class="form-label">Course Score</label>
                                <input type="number" class="form-control" id="course_score" name="course_score" min="0"
                                    max="100" required>
                            </div>

                        </div>
                        <button type="submit" class="btn btn-primary">Save Course</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Course Modal -->
    <div class="modal fade" id="editCourseModal" tabindex="-1" aria-labelledby="editCourseModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editCourseModalLabel">Edit Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editCourseForm">
                        <input type="hidden" id="edit_course_id" name="edit_course_id">

                        <div class="mb-3">
                            <label for="edit_course_name" class="form-label">Course Code</label>
                            <input type="text" class="form-control" id="edit_course_name" name="edit_course_name"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="edit_course_credit" class="form-label">Course Credit Unit</label>
                            <input type="number" class="form-control" id="edit_course_credit" name="edit_course_credit"
                                min="1" max="6" required>
                        </div>
                        <div class="mb-3">

                            <div class="mb-3">
                                <label for="edit_course_score">Course Score</label>
                                <input type="number" class="form-control" id="edit_course_score" name="course_score"
                                    min="0" max="100" required>
                            </div>


                        </div>
                        <button type="submit" class="btn btn-primary">Update Course</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Course Modal -->
    <div class="modal fade" id="deleteCourseModal" tabindex="-1" aria-labelledby="deleteCourseModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteCourseModalLabel">Delete Course</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="delete_course_id">
                    <h4>Are you sure you want to delete this course?</h4>
                    <div class="mt-3">
                        <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete</button>
                        <button type="button" class="btn btn-secondary ms-2" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    // Grade point mapping
    const gradePoints = {
        'A': 5.00,
        'B': 4.00,
        'C': 3.00,
        'D': 2.00,
        'F': 0.00
    };

    function convertScoreToPoint(score) {
        if (score >= 70) return 'A';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        if (score >= 45) return 'D';
        return 'F';
    }


    // Storage for courses
    let courses = [];
    let courseIdCounter = 1;

    // Load courses from localStorage on page load
    document.addEventListener('DOMContentLoaded', function() {
        loadCoursesFromStorage();
        displayCourses();
    });

    // Add course form handler
    document.getElementById('addCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const course = {
            id: courseIdCounter++,
            level: formData.get('level'),
            course: formData.get('course_name'),
            credit: parseInt(formData.get('course_credit')),
            score: parseInt(formData.get('course_score')),
            point: convertScoreToPoint(parseInt(formData.get('course_score'))),
            semester: formData.get('course_semester')
        };

        courses.push(course);
        saveCoursesToStorage();
        displayCourses();

        // Reset form and close modal
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();

        showAlert('Course added successfully!', 'success');
    });

    // Edit course form handler
    document.getElementById('editCourseForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const courseId = parseInt(formData.get('edit_course_id'));

        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
            const score = parseInt(formData.get('course_score'));
            courses[courseIndex].course = formData.get('edit_course_name');
            courses[courseIndex].credit = parseInt(formData.get('edit_course_credit'));
            courses[courseIndex].score = score;
            courses[courseIndex].point = convertScoreToPoint(score);


            saveCoursesToStorage();
            displayCourses();

            bootstrap.Modal.getInstance(document.getElementById('editCourseModal')).hide();
            showAlert('Course updated successfully!', 'success');
        }
    });

    // Edit course modal population
    document.getElementById('editCourseModal').addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const courseId = parseInt(button.getAttribute('data-id'));
        const course = courses.find(c => c.id === courseId);

        if (course) {
            document.getElementById('edit_course_id').value = course.id;
            document.getElementById('edit_course_name').value = course.course;
            document.getElementById('edit_course_credit').value = course.credit;
            document.getElementById('edit_course_score').value = course.score;
        }
    });

    // Delete course modal population
    document.getElementById('deleteCourseModal').addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const courseId = button.getAttribute('data-id');
        document.getElementById('delete_course_id').value = courseId;
    });

    // Confirm delete function
    function confirmDelete() {
        const courseId = parseInt(document.getElementById('delete_course_id').value);
        courses = courses.filter(c => c.id !== courseId);

        saveCoursesToStorage();
        displayCourses();

        bootstrap.Modal.getInstance(document.getElementById('deleteCourseModal')).hide();
        showAlert('Course deleted successfully!', 'success');
    }

    // Display courses function
    function displayCourses() {
        const container = document.getElementById('courseTables');
        container.innerHTML = '';

        if (courses.length === 0) {
            container.innerHTML =
                '<div class="text-center text-muted"><h4>No courses added yet. Click "Add Course" to get started.</h4></div>';
            document.getElementById('overallCGPA').style.display = 'none';
            return;
        }

        const levels = [...new Set(courses.map(c => c.level))].sort();
        let overallTotalPoints = 0;
        let overallTotalCredits = 0;

        levels.forEach(level => {
            let levelTotalPoints = 0;
            let levelTotalCredits = 0;

            const levelHtml = `
                    <h3 class="text-primary">${level} Level</h3>
                    ${generateSemesterTable(level, '1', 'First Semester')}
                    ${generateSemesterTable(level, '2', 'Second Semester')}
                `;

            container.innerHTML += levelHtml;

            // Calculate level totals
            const levelCourses = courses.filter(c => c.level === level);
            levelCourses.forEach(course => {
                const points = course.credit * gradePoints[course.point];
                levelTotalPoints += points;
                levelTotalCredits += course.credit;
            });

            // Add level CGPA display
            const levelCgpa = levelTotalCredits > 0 ? (levelTotalPoints / levelTotalCredits).toFixed(2) :
            '0.00';
            container.innerHTML += `
                    <div class="mb-4">
                        <h4>${level} Level CGPA: <span class="text-success">${levelCgpa}</span></h4>
                        <hr class="border-danger border-2">
                    </div>
                `;

            overallTotalPoints += levelTotalPoints;
            overallTotalCredits += levelTotalCredits;
        });

        // Display overall CGPA
        const overallCgpa = overallTotalCredits > 0 ? (overallTotalPoints / overallTotalCredits).toFixed(2) : '0.00';
        document.getElementById('cgpaValue').textContent = overallCgpa;
        document.getElementById('overallCGPA').style.display = 'block';
    }

    // Generate semester table
    function generateSemesterTable(level, semester, semesterName) {
        const semesterCourses = courses.filter(c => c.level === level && c.semester === semester);

        if (semesterCourses.length === 0) {
            return `
                    <h4 class="text-secondary">${semesterName}</h4>
                    <div class="alert alert-info">No courses added for this semester.</div>
                `;
        }

        let totalCredits = 0;
        let totalPoints = 0;

        const rows = semesterCourses.map(course => {
            const points = course.credit * gradePoints[course.point];
            totalCredits += course.credit;
            totalPoints += points;

            return `
                    <tr>
                        <td>${course.course}</td>
                        <td>${course.credit}</td>
                        <td>${points.toFixed(2)}</td>
                        <td>${course.point}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" data-bs-toggle="modal" 
                                    data-bs-target="#editCourseModal" data-id="${course.id}">
                                Update
                            </button>
                            <button class="btn btn-danger btn-sm ms-1" data-bs-toggle="modal" 
                                    data-bs-target="#deleteCourseModal" data-id="${course.id}">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
        }).join('');

        const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

        return `
                <h4 class="text-secondary">${semesterName}</h4>
                <table class="table table-bordered table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>Course</th>
                            <th>Credit</th>
                            <th>Points</th>
                            <th>Grade</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr class="table-info">
                            <td><b>Total Credits:</b> ${totalCredits}</td>
                            <td><b>Total Points:</b> ${totalPoints.toFixed(2)}</td>
                            <td colspan="3"><b>GPA:</b> ${gpa}</td>
                        </tr>
                    </tfoot>
                </table>
            `;
    }

    // Storage functions
    function saveCoursesToStorage() {
        localStorage.setItem('cgpa_courses', JSON.stringify(courses));
        localStorage.setItem('cgpa_counter', courseIdCounter.toString());
    }

    function loadCoursesFromStorage() {
        const stored = localStorage.getItem('cgpa_courses');
        const counter = localStorage.getItem('cgpa_counter');

        if (stored) {
            courses = JSON.parse(stored);
        }

        if (counter) {
            courseIdCounter = parseInt(counter);
        }
    }

    // Export/Import functions
    function exportData() {
        const data = {
            courses: courses,
            counter: courseIdCounter,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cgpa_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showAlert('Data exported successfully!', 'success');
    }

    function importData() {
        document.getElementById('importFile').click();
    }

    function handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                if (data.courses && Array.isArray(data.courses)) {
                    courses = data.courses;
                    courseIdCounter = data.counter || courseIdCounter;

                    saveCoursesToStorage();
                    displayCourses();

                    showAlert('Data imported successfully!', 'success');
                } else {
                    showAlert('Invalid file format!', 'danger');
                }
            } catch (error) {
                showAlert('Error reading file!', 'danger');
            }
        };
        reader.readAsText(file);
    }

    // Alert function
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

        document.querySelector('.card-body').insertBefore(alertDiv, document.querySelector('.card-body').firstChild);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    </script>
    
</div>   
</div>