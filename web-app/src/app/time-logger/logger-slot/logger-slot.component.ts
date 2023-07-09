import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faCircleXmark, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faDeleteLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, Observable, Subscription, interval } from 'rxjs';
import { Timer, TimerGroup } from 'src/app/model/time-logger.model';
import { TimeLoggerService } from 'src/app/service/time-logger.service';

@Component({
  selector: 'app-logger-slot',
  templateUrl: './logger-slot.component.html',
  styleUrls: ['./logger-slot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoggerSlotComponent implements OnInit {
  @Input() public userId = '';
  @Input() public loggerId = '';
  @Input() public timerGroupId = '';

  public readonly faPlus = faPlus;
  public readonly faTrashCan = faTrashCan;
  public readonly faDeleteLeft = faDeleteLeft;
  public readonly faCircleXmark = faCircleXmark;
  public timerGroup$: Observable<TimerGroup | null> = EMPTY;
  public loggerIsEditMode$: Observable<boolean | null> = EMPTY;
  public refreshTrigger$ = interval(1000);

  constructor(private timeLoggerService: TimeLoggerService) {}

  public ngOnInit(): void {
    // タイマーグループを監視
    this.timerGroup$ = this.timeLoggerService.getTimerGroup(
      this.userId,
      this.loggerId,
      this.timerGroupId
    );
    // loggerのeditModeを監視
    this.loggerIsEditMode$ = this.timeLoggerService.getEditMode(
      this.userId,
      this.loggerId
    );
  }

  /**
   * 与えられたタイマーの経過秒数を返す
   * @param timerGroup タイマーグループ
   * @returns タイマーの総経過時間の合計秒
   */
  public elapsedSec(timer: Timer): number {
    return Timer.elapsedSec(timer);
  }

  /**
   * 与えられたタイマーグループに属するタイマーの総経過時間の合計秒を返す
   * @param timerGroup タイマーグループ
   * @returns タイマーの総経過時間の合計秒
   */
  public elapsedSecSummary(timerGroup: TimerGroup): number {
    return TimerGroup.elapsedSec(timerGroup);
  }

  /**
   * タイマーグループ名を変更する
   * @param newName 変更後の名前
   */
  public changeTimerGroupName(newName: string): void {
    this.timeLoggerService.changeTimerGroupName(
      this.userId,
      this.loggerId,
      this.timerGroupId,
      newName
    );
  }

  /**
   * タイマーグループを削除する
   * @param timerGroupId 削除するタイマーグループのID
   */
  public deleteTimerGroup(timerGroupId: string): void {
    // TODO: 確認ダイアログを出す

    this.timeLoggerService.deleteTimerGroup(
      this.userId,
      this.loggerId,
      timerGroupId
    );
  }

  /**
   * タイマー名を変更する
   * @param timerId タイマーID
   * @param newName 変更後の名前
   */
  public changeTimerName(timerId: string, newName: string): void {
    this.timeLoggerService.changeTimerName(
      this.userId,
      this.loggerId,
      this.timerGroupId,
      timerId,
      newName
    );
  }

  /**
   * タイマーを削除する
   * @param timerId タイマーID
   */
  public deleteTimer(timerId: string): void {
    // TODO: 確認ダイアログを出す

    this.timeLoggerService.deleteTimer(
      this.userId,
      this.loggerId,
      this.timerGroupId,
      timerId
    );
  }

  /**
   * 新しいタイマーを追加する
   */
  public addNewTimer(): void {
    this.timeLoggerService.addTimer(
      this.userId,
      this.loggerId,
      this.timerGroupId,
      Timer.defaultTimer()
    );
  }

  /**
   * タイマークリック処理
   * @param timer クリックされたタイマー
   */
  public clickTimer(timer: Timer): void {
    if (timer.isRunning) {
      // タイマーを停止する
      this.timeLoggerService.stopTimer(
        this.userId,
        this.loggerId,
        this.timerGroupId,
        timer
      );
    } else {
      // タイマーを開始する
      this.timeLoggerService.startTimer(
        this.userId,
        this.loggerId,
        this.timerGroupId,
        timer
      );
    }
  }

  /**
   * タイマーの経過時間をリセットする
   * @param timerId タイマーID
   */
  public resetTimer(timerId: string): void {
    this.timeLoggerService.resetTimer(
      this.userId,
      this.loggerId,
      this.timerGroupId,
      timerId
    );
  }

  /**
   * チラつき防止のため、Timer自体に変更があった場所のみ更新させるための関数
   * @param index
   * @param item
   * @returns
   */
  public trackByFn(index: number, item: Timer): string {
    // 各アイテムの一意な識別子を返す
    return item.id;
  }
}
