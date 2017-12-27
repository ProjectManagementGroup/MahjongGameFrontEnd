import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { UpComponent } from './up/up.component';
import { BottomComponent } from './bottom/bottom.component';
import { CenterComponent } from './center/center.component';
import { LeftComponent } from './left/left.component';
import { RightComponent } from './right/right.component';
import { RoomInformationComponent } from './room-information/room-information.component';
import { TableComponent } from './table/table.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GameHallComponent } from './game-hall/game-hall.component';
import { GameResultComponent } from './game-result/game-result.component';

import { SocketService } from './service/socket.service';
import { OrderTileService } from './service/order-tile.service';
import { CheckTileService } from './service/check-tile.service';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'room', component: RoomInformationComponent },
  { path: 'table', component: TableComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    UpComponent,
    BottomComponent,
    LeftComponent,
    RightComponent,
    CenterComponent,
    TableComponent,
    RoomInformationComponent,
    LoginComponent,
    RegisterComponent,
    GameHallComponent,
    GameResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    OrderTileService,
    CheckTileService,
    SocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
