import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { VotersDialogComponent } from './dialogs/voters-dialog/voters-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CandidatesDialogComponent } from './dialogs/candidates-dialog/candidates-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    VotersDialogComponent,
    CandidatesDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports: [],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
