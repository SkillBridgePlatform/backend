import { StudentCourse } from 'src/students/entities/student-course.entity';

export class StudentDashboard {
  currentCourses: StudentCourse[];
  coursesCompleted: number;
  coursesInProgress: number;
  totalAvailableCourses: number;
}
