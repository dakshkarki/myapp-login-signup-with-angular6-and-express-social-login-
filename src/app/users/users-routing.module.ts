import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import{LoginComponent} from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForpassComponent } from './forpass/forpass.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { VerifyemailComponent }from './verifyemail/verifyemail.component';
import { SetpasswordComponent } from './setpassword/setpassword.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import{ ProfileComponent}from './profile/profile.component';
import{ EditprofileComponent}from './editprofile/editprofile.component';
const routes: Routes = [
    { path: '',
  children: [
  { path: '', component:  LoginComponent, },
  { path: 'signup', component: SignupComponent },
  { path: 'forpass', component: ForpassComponent },
  { path: 'verifyemail' , component: VerifyemailComponent },
  { path: 'setpassword' , component: SetpasswordComponent },
  { path: 'home' , component: DashboardComponent, canActivate : [AuthGuard] },
  { path: 'profile' , component: ProfileComponent},
  { path: 'editprofile' , component: EditprofileComponent},
  { path: '**', component: LoginComponent}

  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes),
    CommonModule,
],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

