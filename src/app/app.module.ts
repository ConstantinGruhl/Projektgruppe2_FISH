import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { NotificationWindowComponent } from './notification-window/notification-window.component';
import { PlayRequestComponent } from './play-request/play-request.component';
import { CalenderComponent } from './calender/calender.component';
import { ColumnComponent } from './column/column.component';
import { FriendslistComponent } from './friendslist/friendslist.component';
import { TimesetterComponent } from './timesetter/timesetter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupDropdownComponent } from './group-dropdown/group-dropdown.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TimeBlockerComponent } from './time-blocker/time-blocker.component';
import { ProfileComponent } from './profile/profile.component';
import { GroupComponent } from './group/group.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { FriendRequestComponent } from './friend-request/friend-request.component';
import { AppointmentRequestComponent } from './appointment-request/appointment-request.component';

import { FriendService } from './_services/friends.service';
import { GamesAndPlatformsService } from './_services/gamesAndPlatforms.service';
import { GroupService } from './_services/group.service';
import { MessagesService } from './_services/messages.service';
import { PlaytimeService } from './_services/playtime.service';
import { ProfileService } from './_services/profile.service';
import { RequestsService } from './_services/requests.service';
import { AccountService } from './_services/account.service';
import { RefreshService } from './_services/refresh.service';
import { FriendComponent } from './friend/friend.component';
import { PlayerInfoComponent } from './player-info/player-info.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { AcceptedRequestsComponent } from './accepted-requests/accepted-requests.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    HeaderComponent,
    ImpressumComponent,
    NotificationWindowComponent,
    PlayRequestComponent,
    CalenderComponent,
    ColumnComponent,
    FriendslistComponent,
    TimesetterComponent,
    GroupDropdownComponent,
    RegisterComponent,
    ResetPasswordComponent,
    TimeBlockerComponent,
    ProfileComponent,
    GroupComponent,
    CreateGroupComponent,
    AddFriendComponent,
    FriendRequestComponent,
    AppointmentRequestComponent,
    FriendComponent,
    PlayerInfoComponent,
    AcceptedRequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    FriendService,
    GamesAndPlatformsService,
    GroupService,
    MessagesService,
    PlaytimeService,
    ProfileService,
    RequestsService,
    AccountService,
    RefreshService
],
  bootstrap: [AppComponent]
})
export class AppModule { }
