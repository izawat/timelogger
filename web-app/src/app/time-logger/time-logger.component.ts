import { Component, OnInit } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { UserDetail } from '../model/user.model';
import { UserService } from '../service/user.service';
import { TimeLoggerService } from '../service/time-logger.service';
import { Observable, EMPTY } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { TimerGroup } from '../model/time-logger.model';

@Component({
  selector: 'app-time-logger',
  templateUrl: './time-logger.component.html',
  styleUrls: ['./time-logger.component.scss'],
})
export class TimeLoggerComponent implements OnInit {
  public readonly user$: Observable<User | null> = EMPTY;
  public readonly userDetail$: Observable<UserDetail | null> = EMPTY;
  public userId = '';
  public loggerId = '';
  public timerGroups$: Observable<TimerGroup[] | null> = EMPTY;

  constructor(
    private route: ActivatedRoute,
    private auth: Auth,
    private userService: UserService,
    private timeLoggerService: TimeLoggerService
  ) {
    this.user$ = authState(this.auth);
    if (this.auth.currentUser) {
      this.userDetail$ = this.userService.getUserDetail(
        this.auth.currentUser.uid
      );
      this.userId = this.auth.currentUser.uid;
    } else {
      this.userId = '';
    }
  }

  public ngOnInit(): void {
    // URLからloggerIdを取得
    this.route.params.subscribe((params) => {
      this.loggerId = params['loggerId'];
      // timerGroupsを取得
      this.timerGroups$ = this.timeLoggerService.getTimerGroups(
        this.userId,
        this.loggerId
      );
    });
  }

  /**
   * チラつき防止のため、TimerGroup自体に変更があった場所のみ更新させるための関数
   * @param index
   * @param item
   * @returns
   */
  public trackByFn(index: number, item: TimerGroup): string {
    // 各アイテムの一意な識別子を返す
    return item.id;
  }
}
