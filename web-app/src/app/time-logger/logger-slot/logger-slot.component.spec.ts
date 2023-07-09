import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerSlotComponent } from './logger-slot.component';

describe('LoggerSlotComponent', () => {
  let component: LoggerSlotComponent;
  let fixture: ComponentFixture<LoggerSlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggerSlotComponent]
    });
    fixture = TestBed.createComponent(LoggerSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
