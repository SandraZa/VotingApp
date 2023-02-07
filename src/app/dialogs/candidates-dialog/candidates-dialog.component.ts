import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { dataType } from 'src/app/shared/voting-service.model';

@Component({
  selector: 'app-candidates-dialog',
  templateUrl: './candidates-dialog.component.html',
  styleUrls: ['./candidates-dialog.component.scss'],
})
export class CandidatesDialogComponent {
  public isError: boolean = false;
  public myForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CandidatesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {}

  public checkCandidate(ev: Event) {
    this.data.list.some(
      (elem) => elem === (ev.target as HTMLInputElement).value
    )
      ? (this.isError = true)
      : (this.isError = false);
  }

  public cancel(addCandidateForm: NgForm): void {
    addCandidateForm.reset();
    this.dialogRef.close();
  }
}
