import { Component, Input, OnInit } from '@angular/core';
import {
  faCircleCheck,
  faPenToSquare,
} from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, Observable } from 'rxjs';
import { TimerGroup } from 'src/app/model/time-logger.model';
import { TimeLoggerService } from 'src/app/service/time-logger.service';

@Component({
  selector: 'app-empty-slot',
  templateUrl: './empty-slot.component.html',
  styleUrls: ['./empty-slot.component.scss'],
})
export class EmptySlotComponent implements OnInit {
  @Input() public userId = '';
  @Input() public loggerId = '';

  public readonly faPlus = faPlus;
  public readonly faPenToSquare = faPenToSquare;
  public readonly faCircleCheck = faCircleCheck;
  public loggerIsEditMode$: Observable<boolean | null> = EMPTY;

  constructor(private timeLoggerService: TimeLoggerService) {}

  public ngOnInit(): void {
    // loggerのeditModeを監視
    this.loggerIsEditMode$ = this.timeLoggerService.getEditMode(
      this.userId,
      this.loggerId
    );
  }

  /**
   * Adds a new slot to the time logger.
   */
  public addSlot(): void {
    // 新しいタイマーグループを追加
    this.timeLoggerService.addTimerGroup(
      this.userId,
      this.loggerId,
      TimerGroup.defaultTimerGroup()
    );
    // 編集モードへ移行
    this.enterEditMode();
  }

  /** 編集モードに入る */
  public enterEditMode(): void {
    this.timeLoggerService.updateEditMode(this.userId, this.loggerId, true);
  }
  /** 変数モードを終える */
  public exitEditMode(): void {
    this.timeLoggerService.updateEditMode(this.userId, this.loggerId, false);
  }
}
