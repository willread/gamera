import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Ng2SearchPipeModule, Ng2SearchPipe } from 'ng2-search-filter';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { GameSearchComponent } from './game-search/game-search.component';
import { ListComponent } from './list/list.component';
import { GameComponent } from './game/game.component';
import { FilterGamesPipe } from './pipes/filter-games.pipe';
import { SortGamesPipe } from './pipes/sort-games.pipe';
import { TimePlayedComponent } from './time-played/time-played.component';
import { UserComponent } from './user/user.component';
import { GameFilterComponent } from './game-filter/game-filter.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { HomeComponent } from './home/home.component';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';
import { PlatformPipe } from './pipes/platform.pipe';
import { PlatformBadgeComponent } from './platform-badge/platform-badge.component';
import { LightOrDarkPipe } from './pipes/light-or-dark.pipe';
import { FooterComponent } from './footer/footer.component';
import { GameCardComponent } from './game-card/game-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProfileComponent,
    GameSearchComponent,
    ListComponent,
    GameComponent,
    FilterGamesPipe,
    SortGamesPipe,
    TimePlayedComponent,
    UserComponent,
    GameFilterComponent,
    RelativeTimePipe,
    ActivityListComponent,
    HomeComponent,
    SecondsToTimePipe,
    PlatformPipe,
    PlatformBadgeComponent,
    LightOrDarkPipe,
    FooterComponent,
    GameCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng2SearchPipeModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    StorageServiceModule,
    ChartsModule,

    // Material

    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatExpansionModule
  ],
  providers: [
    FilterGamesPipe,
    SortGamesPipe,
    Ng2SearchPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
