import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLoggerRoutingModule } from './time-logger-routing.module';
import { TimeLoggerComponent } from './time-logger.component';
import { LoggerSlotComponent } from './logger-slot/logger-slot.component';
import { EmptySlotComponent } from './empty-slot/empty-slot.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimeLoggerComponent, LoggerSlotComponent, EmptySlotComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    FontAwesomeModule,
    TimeLoggerRoutingModule,
  ],
})
export class TimeLoggerModule {}
