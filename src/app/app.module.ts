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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ProfileComponent } from './profile/profile.component';
import { GameSearchComponent } from './game-search/game-search.component';
import { ListComponent } from './list/list.component';
import { GameComponent } from './game/game.component';
import { FilterGamesPipe } from './filter-games.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProfileComponent,
    GameSearchComponent,
    ListComponent,
    GameComponent,
    FilterGamesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng2SearchPipeModule,

    // Material

    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [
    FilterGamesPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }