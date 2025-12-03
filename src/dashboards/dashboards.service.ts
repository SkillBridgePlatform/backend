import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassesRepository } from 'src/classes/repositories/classes.repository';
import { UserRole } from 'src/common/enums';
import { SchoolsRepository } from 'src/schools/schools.repository';
import { StudentsRepository } from 'src/students/repositories/students.repository';
import { StudentCoursesService } from 'src/students/services/student-courses.service';
import { UsersRepository } from 'src/users/users.repository';
import { SchoolDashboard } from './entities/school-dashboard.entity';
import { StudentDashboard } from './entities/student-dashboard.entity';
import { SuperAdminDashboard } from './entities/super-admin-dashboard.entity';

@Injectable()
export class DashboardsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly schoolsRepository: SchoolsRepository,
    private readonly studentsRepository: StudentsRepository,
    private readonly classesRepository: ClassesRepository,
    private readonly studentCoursesService: StudentCoursesService,
  ) {}

  async getSuperAdminDashboard(): Promise<SuperAdminDashboard> {
    const [totalSchools, totalSchoolAdmins, totalTeachers, totalStudents] =
      await Promise.all([
        this.schoolsRepository.countSchools(),
        this.usersRepository.countUsersByRole(UserRole.SchoolAdmin),
        this.usersRepository.countUsersByRole(UserRole.Teacher),
        this.studentsRepository.countStudents(),
      ]);

    return {
      totalSchools,
      totalSchoolAdmins,
      totalTeachers,
      totalStudents,
    };
  }

  async getSchoolDashboard(
    authUser,
    schoolId: string,
  ): Promise<SchoolDashboard> {
    const promiseList = [
      this.usersRepository.countUsersByRole(UserRole.Teacher, schoolId),
      this.studentsRepository.countStudentsBySchool(schoolId),
      this.studentsRepository.countStudentsBySchool(schoolId),
      this.classesRepository.countClassesBySchool(schoolId),
    ];

    if (authUser.app_metadata.role == UserRole.SuperAdmin) {
      promiseList.push(
        this.usersRepository.countUsersByRole(UserRole.SchoolAdmin, schoolId),
      );
    }
    const [totalTeachers, totalStudents, totalSchoolAdmins, totalClasses] =
      await Promise.all(promiseList);

    const school = await this.schoolsRepository.getSchoolById(schoolId);
    if (!school) throw new NotFoundException('School not found');

    return {
      school,
      totalSchoolAdmins,
      totalTeachers,
      totalStudents,
      totalClasses,
    };
  }

  async getStudentDashboard(studentId: string): Promise<StudentDashboard> {
    const allCourses =
      await this.studentCoursesService.getStudentCourses(studentId);

    const totalAvailableCourses = allCourses.length;

    const currentCourses = allCourses.filter(
      (course) => course.status === 'in_progress',
    );

    const coursesCompleted = allCourses.filter(
      (course) => course.status === 'completed',
    ).length;

    const coursesInProgress = currentCourses.length;

    return {
      currentCourses,
      coursesCompleted,
      coursesInProgress,
      totalAvailableCourses,
    };
  }
}
