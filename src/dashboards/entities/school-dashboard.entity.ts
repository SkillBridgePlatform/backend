import { School } from 'src/schools/entities/schools.entity';

export class SchoolDashboard {
  school: School;
  totalSchoolAdmins: number | null;
  totalTeachers: number;
  totalStudents: number;
  totalClasses: number;
}
