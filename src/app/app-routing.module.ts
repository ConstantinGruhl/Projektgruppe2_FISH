import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ProfileComponent} from './profile/profile.component';
import {CreateGroupComponent} from './create-group/create-group.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {AddFriendComponent} from './add-friend/add-friend.component';

const routes: Routes = [
  { path:'', component: IndexComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'ResetPassword', component: ResetPasswordComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'createGroup', component: CreateGroupComponent},
  {path: 'addFriend', component: AddFriendComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
