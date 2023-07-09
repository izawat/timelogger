import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { UserDetail } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private dbPath = '/userDetails';

  constructor(private db: AngularFireDatabase) {}

  /**
   * ユーザ詳細情報を取得する
   * @param id FirebaseAuthenticationのユーザID
   * @returns ユーザ詳細
   */
  public getUserDetail(id: string): Observable<UserDetail | null> {
    return this.db.object<UserDetail>(`${this.dbPath}/${id}`).valueChanges();
  }

  /**
   * ユーザ詳細情報を上書きする
   * @param userDetail ユーザ詳細
   */
  public updateUserDetail(userDetail: UserDetail): void {
    this.db
      .object<UserDetail>(`${this.dbPath}/${userDetail.id}`)
      .update(userDetail)
      .then(() => {
        console.log('updateUserDetail success');
      })
      .catch((error) => {
        console.error('updateUserDetail error', error);
      });
  }

  // public getRoom(roomId: string): Observable<Room | null> {
  //   return this.db.object<Room>(`${this.dbPath}/${roomId}`).valueChanges();
  // }

  // public addRoom(room: Room): void {
  //   this.db.list(this.dbPath).set(room.id, room);
  // }

  // public getUsers(roomId: string): Observable<User[]> {
  //   return this.db.list<User>(`${this.dbPath}/${roomId}/users`).valueChanges();
  // }

  // public joinRoom(roomId: string, user: User): void {
  //   this.db.list(`${this.dbPath}/${roomId}/users`).set(user.id, user);
  // }

  // public setAnswer(roomId: string, userId: string, answer: string): void {
  //   this.db.object(`${this.dbPath}/${roomId}/users/${userId}`).update({
  //     answer: answer,
  //   });
  // }

  // public openAnswer(roomId: string): void {
  //   this.db.object(`${this.dbPath}/${roomId}`).update({
  //     isOpened: true,
  //   });
  // }

  // public closeAnswer(roomId: string): void {
  //   this.db.object(`${this.dbPath}/${roomId}`).update({
  //     isOpened: false,
  //   });
  // }
}
