import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dataType } from 'src/app/shared/voting-service.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './voters-dialog.component.html',
  styleUrls: ['./voters-dialog.component.scss'],
})
export class VotersDialogComponent {
  public isError: boolean = false;
  public myForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<VotersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {}

  public checkVoter(ev: Event) {
    this.data.list.some(
      (elem) => elem === (ev.target as HTMLInputElement).value
    )
      ? (this.isError = true)
      : (this.isError = false);
  }

  public cancel(voterForm: NgForm): void {
    voterForm.reset();
    this.dialogRef.close();
  }
}
