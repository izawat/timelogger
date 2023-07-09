import { Component } from '@angular/core';
import * as uuid from 'uuid';

import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  authState,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { EMPTY, Observable, Subscription, map, take } from 'rxjs';
import { traceUntilFirst } from '@angular/fire/performance';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../service/user.service';
import { UserDetail } from '../model/user.model';
import { TimeLoggerService } from '../service/time-logger.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public readonly faStopwatch = faStopwatch;

  private readonly userDisposable: Subscription | undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private userService: UserService,
    private timeLoggerService: TimeLoggerService
  ) {
    this.user = authState(this.auth);
    this.userDisposable = authState(this.auth)
      .pipe(
        traceUntilFirst('auth'),
        map((u) => !!u)
      )
      .subscribe((isLoggedIn) => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
        if (isLoggedIn && this.auth.currentUser) {
          // ユーザ新規作成 or 詳細情報更新
          this.createUserDetail(this.auth.currentUser);
        } else {
          // ログアウト時はhomeにリダイレクト
          this.router.navigate(['/']);
        }
      });
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

  /**
   * GoogleアカウントでログインするPopupを開く
   * @returns ログイン結果
   */
  public async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider);
  }

  /**
   * 匿名でログインする
   * @returns ログイン結果
   */
  public async signInAnonymously(): Promise<UserCredential> {
    return await signInAnonymously(this.auth);
  }

  /**
   * ログアウトする
   */
  public async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  /**
   * ログイン成功したユーザーの詳細情報を作成する
   * @param user ログイン成功したユーザー
   */
  private createUserDetail(user: User): void {
    this.userService
      .getUserDetail(user.uid)
      .pipe(take(1))
      .subscribe((userDetail) => {
        if (!userDetail) {
          // ユーザ詳細情報が存在しない場合、新規作成する
          const createdAt = new Date();
          userDetail = new UserDetail();
          userDetail.id = user.uid;
          userDetail.name = user.displayName || '';
          userDetail.timeLoggers = [
            {
              id: uuid.v4(),
              name: 'first time logger',
            },
          ];
          userDetail.createdAt = createdAt;
          // 1つ目のタイムロガーを初期化する
          this.timeLoggerService.initTimeLogger(
            userDetail.id,
            userDetail.timeLoggers[0].id,
            userDetail.timeLoggers[0].name,
            createdAt
          );
        }
        userDetail.lastLogin = new Date();
        // ユーザ詳細情報を更新する
        this.userService.updateUserDetail(userDetail);
        // 完了したら、メインパネルをタイムロガー画面に遷移させる
        this.router.navigate(['/room', userDetail.timeLoggers[0].id]);
      });
  }
}
