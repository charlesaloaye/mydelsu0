<?php

namespace App\Livewire;

use Illuminate\Support\Facades\Auth;

use App\Models\Course;
use Livewire\Component;
use Livewire\Attributes\Rule;
use Livewire\Attributes\Title;

#[Title('CGPA Calculator')]
class CgpaCalculator extends Component
{
    // Form properties
    #[Rule('required|in:100,200,300,400,500')]
    public $level = '';

    #[Rule('required|string|max:20')]
    public $course_code = '';

    #[Rule('required|integer|min:1|max:6')]
    public $credit_unit = '';

    #[Rule('required|in:1,2')]
    public $semester = 1;

    #[Rule('required|integer|min:0|max:100')]
    public $score = '';

    // Edit form properties
    public $editingCourse = null;
    public $edit_course_code = '';
    public $edit_credit_unit = '';
    public $edit_score = '';

    // Modal states
    public $showAddModal = false;
    public $showEditModal = false;
    public $showDeleteModal = false;
    public $courseToDelete = null;

    protected $listeners = ['courseDeleted' => '$refresh'];

    public function mount()
    {
        // Initialize component
    }

    public function render()
    {
        $courses = Course::where('email', Auth::user()->email)
            ->orderBy('semester')
            ->orderBy('course_code')
            ->get();


        // $coursesByLevel = $courses->groupBy('level');
        $coursesByLevel = $courses->groupBy('level')->sortKeysUsing(function ($a, $b) {
            return intval($a) <=> intval($b);
        });

        $overallStats = $this->calculateOverallCGPA($courses);

        return view('livewire.cgpa-calculator', [
            'courses' => $courses,
            'coursesByLevel' => $coursesByLevel,
            'overallStats' => $overallStats
        ]);
    }

    public function addCourse()
    {
        $this->validate();

        Course::create([
            'email' => Auth::user()->email,
            'course_code' => strtoupper($this->course_code),
            'level' => $this->level,
            'credit_unit' => $this->credit_unit,
            'semester' => $this->semester,
            'score' => $this->score,
        ]);

        $this->reset(['level', 'course_code', 'credit_unit', 'semester', 'score']);
        $this->showAddModal = false;

        session()->flash('message', 'Course added successfully!');
        session()->flash('type', 'success');
    }

    public function editCourse($courseId)
    {
        $this->editingCourse = Course::findOrFail($courseId);
        $this->edit_course_code = $this->editingCourse->course_code;
        $this->edit_credit_unit = $this->editingCourse->credit_unit;
        $this->edit_score = $this->editingCourse->score;
        $this->showEditModal = true;
    }

    public function updateCourse()
    {
        $this->validate([
            'edit_course_code' => 'required|string|max:20',
            'edit_credit_unit' => 'required|integer|min:1|max:6',
            'edit_score' => 'required|integer|min:0|max:100',
        ]);

        $this->editingCourse->update([
            'course_code' => strtoupper($this->edit_course_code),
            'credit_unit' => $this->edit_credit_unit,
            'score' => $this->edit_score,
        ]);

        $this->reset(['editingCourse', 'edit_course_code', 'edit_credit_unit', 'edit_score']);
        $this->showEditModal = false;

        session()->flash('message', 'Course updated successfully!');
        session()->flash('type', 'success');
    }

    public function confirmDelete($courseId)
    {
        $this->courseToDelete = Course::findOrFail($courseId);
        $this->showDeleteModal = true;
    }

    public function deleteCourse()
    {
        if ($this->courseToDelete) {
            $this->courseToDelete->delete();
            $this->courseToDelete = null;
            $this->showDeleteModal = false;

            session()->flash('message', 'Course deleted successfully!');
            session()->flash('type', 'success');
        }
    }

    public function closeModal()
    {
        $this->showAddModal = false;
        $this->showEditModal = false;
        $this->showDeleteModal = false;
        $this->reset(['level', 'course_code', 'credit_unit', 'semester', 'score']);
        $this->reset(['editingCourse', 'edit_course_code', 'edit_credit_unit', 'edit_score']);
        $this->courseToDelete = null;
    }

    public function openAddModal()
    {
        $this->showAddModal = true;
    }

    private function calculateLevelCGPA($courses)
    {
        $totalCredits = $courses->sum('credit_unit');
        $totalPoints = $courses->sum('points');

        return $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.00;
    }

    private function calculateSemesterGPA($courses)
    {
        $totalCredits = $courses->sum('credit_unit');
        $totalPoints = $courses->sum('points');

        return $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.00;
    }

    private function calculateOverallCGPA($courses)
    {
        $totalCredits = $courses->sum('credit_unit');
        $totalPoints = $courses->sum('points');

        return [
            'cgpa' => $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.00,
            'totalCredits' => $totalCredits,
            'totalPoints' => $totalPoints
        ];
    }

    public function getLevelStats($levelCourses)
    {
        return [
            'cgpa' => $this->calculateLevelCGPA($levelCourses),
            'totalCredits' => $levelCourses->sum('credit_unit'),
            'totalPoints' => $levelCourses->sum('points')
        ];
    }

    public function getSemesterStats($semesterCourses)
    {
        return [
            'gpa' => $this->calculateSemesterGPA($semesterCourses),
            'totalCredits' => $semesterCourses->sum('credit_unit'),
            'totalPoints' => $semesterCourses->sum('points')
        ];
    }
}
