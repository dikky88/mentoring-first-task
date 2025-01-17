import {Injectable} from "@angular/core";
import {User} from "../interfaces/user.interface";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: 'root'})
export class UsersService {
  private readonly STORAGE_KEY = 'users';
  private usersSubject$ = new BehaviorSubject<User[]>(this.loadUsersFromStorage());
  public readonly users$ = this.usersSubject$.asObservable()

  public loadUsersFromStorage(): User[] {
    const storedUsers = localStorage.getItem(this.STORAGE_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  private saveUsersToStorage(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  public setUsers(users: User[]) {
    this.usersSubject$.next(users);
    this.saveUsersToStorage(users);
  }

  public editUser(editedUser: User) {
    const updatedUsers = this.usersSubject$.value.map(
        user => user.id === editedUser.id ? editedUser : user
      )
    this.usersSubject$.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);
  }

  public createUser(user: User) {
    const existingUser = this.usersSubject$.value.find(
      currentElement => currentElement.email.toLowerCase() === user.email.toLowerCase()
    )

    if (existingUser) {
      alert('такой емейл уже зарегистрирован')
    } else {
      const updatedUsers = [...this.usersSubject$.value, user];
      this.usersSubject$.next(updatedUsers);
      this.saveUsersToStorage(updatedUsers);
      alert('новый пользователь успешно добавлен')
    }
  }

  public deleteUser(id: number) {
    const updatedUsers = this.usersSubject$.value.filter((user) => user.id !== id)
    this.usersSubject$.next(updatedUsers);
    this.saveUsersToStorage(updatedUsers);
  }
}
