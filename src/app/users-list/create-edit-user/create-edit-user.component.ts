import {Component, EventEmitter, inject, Output} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {User} from "../../interfaces/user.interface";
import {MAT_DIALOG_DATA, MatDialogClose, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: "app-create-edit-user",
  templateUrl: "./create-edit-user.component.html",
  styleUrls: ["./create-edit-user.component.scss"],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatDialogClose,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogTitle,
    MatButton
  ],
  standalone: true
})
export class CreateEditUserComponent {
  @Output()
  createEditUser = new EventEmitter();

  readonly data = inject<{user: User, isEdit: boolean}>(MAT_DIALOG_DATA)
  readonly dialogRef: MatDialogRef<CreateEditUserComponent> = inject(MatDialogRef<CreateEditUserComponent>)

  public form = new FormGroup({
    name: new FormControl(this.data.isEdit ? this.data.user.name : '', [Validators.required, Validators.minLength(2)]),
    email: new FormControl(this.data.isEdit ? this.data.user.email : '', [Validators.required, Validators.email]),
    website: new FormControl(this.data.isEdit ? this.data.user.website : '', [Validators.required, Validators.minLength(3)]),
    companyName: new FormControl(this.data.isEdit ? this.data.user.company.name : '', [Validators.required, Validators.minLength(2)]),
  })

  public submitForm():void {
    if (this.data.isEdit) {
      this.createEditUser.emit(this.form.value)
      this.form.reset()
    } else {
      this.dialogRef.close(this.form.value)
    }
  }

  get userWithUpdatedFields() {
    return {
      ...this.form.value,
      id: this.data.user.id
    }
  }
}
