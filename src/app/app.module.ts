import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


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

import { GameResultService } from './service/game-result.service';
import { PlayerService } from './service/player.service';
import { UselessTileService } from './service/useless-tile.service';
import { UsingTileService } from './service/using-tile.service';
import { UsedTileService } from './service/used-tile.service';

import { GameComponent } from './game/game.component';
import { OrderTileService } from './service/order-tile.service';
import { CheckTileService } from './service/check-tile.service';

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
    GameResultComponent,
    GameComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    GameResultService,
    PlayerService,
    UselessTileService,
    UsedTileService,
    UsingTileService,
    OrderTileService,
    CheckTileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
