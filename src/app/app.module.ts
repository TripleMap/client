import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "../components/app/app.component";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// materialComponents
import { MatTooltipModule } from "@angular/material";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// other Modules
import { DndModule } from 'ng2-dnd';
import { ColorPickerModule } from './color-dialog/color-dialog.component'
import { GridsterModule } from 'angular-gridster2';



// services
import { ApiHTTPInterceptorService } from "../services/ApiHTTPInterceptorService";
import { MessageService } from '../services/MessageService';
import { MapService } from "../services/MapService";
import { MapLayersService } from "../services/MapLayersService";

//auth
import { Login } from '../auth/login/login';
import { AuthService, AuthHttpInterceptorService } from '../auth/auth-service';
import { AuthGuard } from '../auth/auth-guard';
import { RoleGuard } from '../auth/role-guard';
import { Register } from '../auth/register/register.component';
import { NotFound } from './not-found/not-found.component';
import { ConfirmDialogDialog } from './confirm-dialog/confirm-dialog.component';




//main
import { TdmapSistem } from '../components/tdmap-sistem/tdmap-sistem.component';
import { MainGridPanelComponent } from '../components/main-grid-panel/main-grid-panel.component';
import { TdmapComponent } from "../components/tdmap/tdmap.component";

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogDialog,
    Login,
    NotFound,
    Register,
    TdmapSistem,
    MainGridPanelComponent,
    TdmapComponent
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    GridsterModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatDialogModule,
    MatStepperModule,
    ColorPickerModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthHttpInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiHTTPInterceptorService,
    multi: true
  },
  { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    MessageService,
    AuthService,
    AuthGuard,
    RoleGuard,
    MapService,
    MapLayersService
  ],
  bootstrap: [AppComponent
  ],
  entryComponents: [
    ConfirmDialogDialog
  ],
})
export class AppModule { }
