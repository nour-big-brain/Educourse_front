import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddCoursComponent } from './components/add-cours/add-cours.component';
import { CoursListComponent } from './components/cours-list/cours-list.component';
import { EtudiantCoursComponent } from './components/etudiant-cours/etudiant-cours.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { CoursMaterialsComponent } from './components/cours-materials/cours-materials.component';
import { ExamListComponent } from './components/exam-list/exam-list.component';
import { AddExamComponent } from './components/add-exam/add-exam.component';
import { AddMaterialComponent } from './components/add-material/add-material.component';
import { TakeExamComponent } from './components/take-exam/take-exam.component';
import { AboutComponent } from './components/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { ExamManagementComponent } from './components/exam-management/exam-management.component';
import { QuestionManagementComponent } from './components/question-management/question-management.component';
import { UpdateQuestionComponent } from './components/update-question/update-question.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'cours', component: AddCoursComponent, canActivate: [TeacherGuard] },
  { path: 'coursList', component: CoursListComponent },
  { path: 'etudiant-cours/:id', component: EtudiantCoursComponent, canActivate: [StudentGuard] },
  { path: 'register', component: SignUpComponent },
  { path: 'cours/:coursId/materials', component: CoursMaterialsComponent, canActivate: [StudentGuard] },
  { path: 'cours/:coursId/exams', component: ExamListComponent, canActivate: [StudentGuard] },
  { path: 'cours/:coursId/exams/:examId/add', component: AddExamComponent, canActivate: [TeacherGuard] },
  { path: 'exam/:coursId/:examId', component: TakeExamComponent, canActivate: [StudentGuard] },
  { path: 'cours/:coursId/materials/add', component: AddMaterialComponent, canActivate: [TeacherGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'manage-questions/:examId', component: QuestionManagementComponent, canActivate: [TeacherGuard] },
  {path:'examManagement',component:ExamManagementComponent,canActivate:[TeacherGuard]},
  { path: 'update-question/:examId/:questionId', component: UpdateQuestionComponent }, // Include examId and questionId
  {path:'',redirectTo:'coursList',pathMatch:'full'}
    


];
