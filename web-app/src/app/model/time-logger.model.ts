import { timer } from 'rxjs';
import * as uuid from 'uuid';

/** 1画面分のタイムロガーを管理 */
export class TimeLogger {
  id: string;
  name: string;
  isEditMode: boolean;
  timerGroups: TimerGroup[];
  createdAt: Date | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.isEditMode = false;
    this.timerGroups = [];
    this.createdAt = null;
  }
}

/** タイマーのグループを管理 */
export class TimerGroup {
  id: string;
  name: string;
  timers: Timer[];
  createdAt: Date | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.timers = [];
    this.createdAt = null;
  }

  /** デフォルト値をセットしたTimerGroupを返す */
  public static defaultTimerGroup(): TimerGroup {
    const timerGroup = new TimerGroup();
    timerGroup.id = uuid.v4();
    timerGroup.name = 'New slot';
    timerGroup.timers = [Timer.defaultTimer()];
    timerGroup.createdAt = new Date();
    return timerGroup;
  }

  /** グループ内のタイマーの経過時間の合計秒を取得 */
  public static elapsedSec(timerGroup: TimerGroup): number {
    let elapsedSec = 0;
    if (timerGroup.timers) {
      timerGroup.timers.forEach((timer) => {
        elapsedSec += Timer.elapsedSec(timer);
      });
    }
    return elapsedSec;
  }
}

/** 1つのタイマーを管理 */
export class Timer {
  id: string;
  name: string;
  startTime: Date | null;
  endTime: Date | null;
  isRunning: boolean;
  elapsedSec: number;
  createdAt: Date | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.startTime = null;
    this.endTime = null;
    this.isRunning = false;
    this.elapsedSec = 0;
    this.createdAt = null;
  }

  /** デフォルト値をセットしたTimerを返す */
  public static defaultTimer(): Timer {
    const timer = new Timer();
    timer.id = uuid.v4();
    timer.name = 'New timer';
    timer.startTime = null;
    timer.endTime = null;
    timer.isRunning = false;
    timer.elapsedSec = 0;
    timer.createdAt = new Date();
    return timer;
  }

  /** タイマーの経過秒を取得 */
  public static elapsedSec(timer: Timer): number {
    // タイマーが動いている場合
    if (timer.isRunning && timer.startTime) {
      return (
        timer.elapsedSec +
        Math.floor(
          (new Date().getTime() - new Date(timer.startTime).getTime()) / 1000
        )
      );
    }
    // タイマーが止まっている場合
    return timer.elapsedSec;
  }

  /**
   * タイマーの経過時間を計算
   * @param startTime 開始時間
   * @param endTime 終了時間
   * @returns 経過(秒)
   */
  public static calculateElapsedSec(startTime: Date, endTime: Date): number {
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  }
}
