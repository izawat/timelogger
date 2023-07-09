import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, take, timer } from 'rxjs';
import { TimeLogger, Timer, TimerGroup } from '../model/time-logger.model';

@Injectable({
  providedIn: 'root',
})
export class TimeLoggerService {
  private dbPath = '/timeLoggers';

  constructor(private db: AngularFireDatabase) {}

  // /**
  //  * タイムロガーを取得する
  //  * @param id タイムロガーID
  //  * @returns タイムロガー
  //  */
  // public getTimeLogger(
  //   userId: string,
  //   loggerId: string
  // ): Observable<TimeLogger | null> {
  //   return this.db
  //     .object<TimeLogger>(`${this.dbPath}/${userId}/${loggerId}`)
  //     .valueChanges();
  // }

  /**
   * タイムロガーを初期化する(新規作成)
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param loggerName タイムロガー名
   * @param createdAt 作成日時
   */
  public initTimeLogger(
    userId: string,
    loggerId: string,
    loggerName: string,
    createdAt: Date
  ): void {
    const timeLogger = new TimeLogger();
    timeLogger.id = loggerId;
    timeLogger.name = loggerName;
    timeLogger.createdAt = createdAt;
    console.log(timeLogger);
    this.db
      .object(`${this.dbPath}/${userId}/${loggerId}`)
      .update(timeLogger)
      .then(() => {
        console.log('initTimeLogger success');
      })
      .catch((error) => {
        console.error('initTimeLogger error', error);
      });
  }

  /**
   * タイムロガーの編集モードを取得する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @returns 編集モード
   */
  public getEditMode(
    userId: string,
    loggerId: string
  ): Observable<boolean | null> {
    return this.db
      .object<boolean>(`${this.dbPath}/${userId}/${loggerId}/isEditMode`)
      .valueChanges();
  }

  /**
   * タイムロガーの編集モードを更新する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param isEditMode 編集モード
   */
  public updateEditMode(
    userId: string,
    loggerId: string,
    isEditMode: boolean
  ): void {
    this.db
      .object(`${this.dbPath}/${userId}/${loggerId}`)
      .update({ isEditMode: isEditMode })
      .then(() => {
        console.log('updateEditMode success', isEditMode);
      })
      .catch((error) => {
        console.error('updateEditMode error', error);
      });
  }

  /**
   * 全タイマーグループを取得する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @returns タイマーグループ
   */
  public getTimerGroups(
    userId: string,
    loggerId: string
  ): Observable<TimerGroup[] | null> {
    return this.db
      .list<TimerGroup>(`${this.dbPath}/${userId}/${loggerId}/timerGroups`)
      .valueChanges()
      .pipe(
        // createdAtが古い順でソートする
        map((timerGroups) => {
          if (timerGroups) {
            timerGroups.sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                return a.createdAt > b.createdAt ? 1 : -1;
              }
              return 0;
            });
          }
          return timerGroups;
        })
      );
  }

  /**
   * タイマーグループを取得する
   * @param id タイマーグループID
   * @returns タイマーグループ
   */
  public getTimerGroup(
    userId: string,
    loggerId: string,
    timerGroupId: string
  ): Observable<TimerGroup | null> {
    return this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}`
      )
      .valueChanges()
      .pipe(
        // timerGroup.timers は Time[] で取得したいが、実際は object になっているので、 Time[] に変換して流す
        map((timerGroup) => {
          if (timerGroup && timerGroup.timers) {
            timerGroup.timers = Object.values(timerGroup.timers);
          }
          return timerGroup;
        }),
        // createdAtが古い順でソートする
        map((timerGroup) => {
          if (timerGroup && timerGroup.timers) {
            timerGroup.timers.sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                return a.createdAt > b.createdAt ? 1 : -1;
              }
              return 0;
            });
          }
          return timerGroup;
        })
      );
  }

  /**
   * タイマーグループを追加する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroup 追加するタイマーグループ
   */
  public addTimerGroup(
    userId: string,
    loggerId: string,
    timerGroup: TimerGroup
  ): void {
    this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroup.id}`
      )
      .update({
        id: timerGroup.id,
        name: timerGroup.name,
        createdAt: timerGroup.createdAt,
      })
      .then(() => {
        console.log('addTimerGroup success', timerGroup);
      })
      .catch((error) => {
        console.error('addTimerGroup error', error);
      });
    // 初期セットするタイマーがあれば追加する
    if (timerGroup.timers && timerGroup.timers.length > 0) {
      timerGroup.timers.forEach((timer) => {
        this.addTimer(userId, loggerId, timerGroup.id, timer);
      });
    }
  }

  /**
   * タイマーグループ名を変更する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param name 変更するタイマーグループ名
   */
  public changeTimerGroupName(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    name: string
  ): void {
    this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}`
      )
      .update({ name: name })
      .then(() => {
        console.log('changeTimerGroupName success', name);
      })
      .catch((error) => {
        console.error('changeTimerGroupName error', error);
      });
  }

  /**
   * タイマーグループを削除する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   */
  public deleteTimerGroup(
    userId: string,
    loggerId: string,
    timerGroupId: string
  ): void {
    this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}`
      )
      .remove()
      .then(() => {
        console.log('deleteTimerGroup success', timerGroupId);
      })
      .catch((error) => {
        console.error('deleteTimerGroup error', error);
      });
  }

  /**
   * 全タイマーを取得する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @returns タイマーグループ
   */
  public getTimers(
    userId: string,
    loggerId: string,
    timerGroupId: string
  ): Observable<Timer[] | null> {
    return this.db
      .list<Timer>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers`
      )
      .valueChanges();
  }

  /**
   * タイマーを追加する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timer 追加するタイマー
   */
  public addTimer(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timer: Timer
  ): void {
    this.db
      .object<Timer>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timer.id}`
      )
      .update(timer)
      .then(() => {
        console.log('addTimer success', timer);
      })
      .catch((error) => {
        console.error('addTimer error', error);
      });
  }

  /**
   * タイマー名を変更する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timerId タイマーID
   * @param name 変更するタイマーID
   */
  public changeTimerName(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timerId: string,
    name: string
  ): void {
    this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timerId}`
      )
      .update({ name: name })
      .then(() => {
        console.log('changeTimerName success', name);
      })
      .catch((error) => {
        console.error('changeTimerName error', error);
      });
  }

  /**
   * タイマーを削除する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timerId タイマーID
   */
  public deleteTimer(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timerId: string
  ): void {
    this.db
      .object<TimerGroup>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timerId}`
      )
      .remove()
      .then(() => {
        console.log('deleteTimer success', timerGroupId);
      })
      .catch((error) => {
        console.error('deleteTimer error', error);
      });
  }

  /**
   * タイマーを開始する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timer 開始するタイマー
   */
  public startTimer(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timer: Timer
  ): void {
    const now = new Date();
    // 現在動いているタイマーを止める
    this.getTimers(userId, loggerId, timerGroupId)
      .pipe(take(1))
      .subscribe((timers) => {
        if (timers) {
          timers.forEach((t) => {
            if (t.id === timer.id) {
              return;
            }
            if (t.isRunning && t.startTime) {
              this.db
                .object<Timer>(
                  `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${t.id}`
                )
                .update({
                  isRunning: false,
                  endTime: now,
                  elapsedSec:
                    t.elapsedSec +
                    Timer.calculateElapsedSec(new Date(t.startTime), now),
                })
                .then(() => {
                  console.log('stopTimer success', t);
                })
                .catch((error) => {
                  console.error('stopTimer error', error);
                });
            }
          });
        }
      });

    // 指定されたタイマーを開始
    this.db
      .object<Timer>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timer.id}`
      )
      .update({ isRunning: true, startTime: now, endTime: null })
      .then(() => {
        console.log('startTimer success');
      })
      .catch((error) => {
        console.error('startTimer error', error);
      });
  }

  /**
   * タイマーを停止する
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timer 停止するタイマー
   */
  public stopTimer(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timer: Timer
  ): void {
    const now = new Date();

    // 指定されたタイマーを停止
    this.db
      .object<Timer>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timer.id}`
      )
      .update({
        isRunning: false,
        endTime: now,
        elapsedSec: timer.startTime
          ? timer.elapsedSec +
            Timer.calculateElapsedSec(new Date(timer.startTime), now)
          : timer.elapsedSec,
      })
      .then(() => {
        console.log('startTimer success');
      })
      .catch((error) => {
        console.error('startTimer error', error);
      });
  }

  /**
   * タイマーの経過時間をリセットする
   * @param userId FirebaseAuthenticationのユーザID
   * @param loggerId タイムロガーID
   * @param timerGroupId タイマーグループID
   * @param timerId タイマーID
   */
  public resetTimer(
    userId: string,
    loggerId: string,
    timerGroupId: string,
    timerId: string
  ): void {
    this.db
      .object<Timer>(
        `${this.dbPath}/${userId}/${loggerId}/timerGroups/${timerGroupId}/timers/${timerId}`
      )
      .update({
        elapsedSec: 0,
      })
      .then(() => {
        console.log('resetTimer success');
      })
      .catch((error) => {
        console.error('resetTimer error', error);
      });
  }
}
