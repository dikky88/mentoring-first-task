import {ChangeDetectionStrategy, Component, inject, Input} from "@angular/core";
import {AsyncPipe, NgForOf} from "@angular/common";
import {UsersApiService} from "../services/users-api.service";
import {UserCardComponent} from "./user-card/user-card.component";
import {UsersService} from "../services/users.service";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {CreateEditUserComponent} from "./create-edit-user/create-edit-user.component";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {CreateEditUser, User} from "../interfaces/user.interface";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  standalone: true,
  imports: [
    NgForOf,
    UserCardComponent,
    AsyncPipe,
    MatButtonModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle
  ],
  styleUrl: "./users-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersListComponent {
  readonly usersApiService = inject(UsersApiService);
  readonly usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);

  public readonly users$ = this.usersService.users$;

  constructor() {
    this.users$ = this.usersService.users$;

    if (this.usersService.loadUsersFromStorage().length === 0) {
      this.usersApiService.getUsers().subscribe(
        (response: User[]) => {
          this.usersService.setUsers(response);
        }
      );
    }
  }

  public deleteUser(id: number) {
    this.usersService.deleteUser(id)
  }

  public editUser(user: CreateEditUser) {
    this.usersService.editUser({
      ...user,
      company: {
        name: user.companyName,
      }
    })
  }

  public createUser(formData: CreateEditUser) {
    this.usersService.createUser({
      id: new Date().getTime(),
      name: formData.name,
      email: formData.email,
      website: formData.website,
      company: {
        name: formData.companyName,
      },
    })
  }

  public openDialog(user: string | User = ''): void {
    const isEdit = user !== '';
    console.log('isEdit: ', isEdit)

    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: {user, isEdit},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        return isEdit ? this.editUser(result) : this.createUser(result);
      }
    });
  }
}
