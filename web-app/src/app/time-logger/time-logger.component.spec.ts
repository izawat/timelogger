import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLoggerComponent } from './time-logger.component';

describe('TimeLoggerComponent', () => {
  let component: TimeLoggerComponent;
  let fixture: ComponentFixture<TimeLoggerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeLoggerComponent]
    });
    fixture = TestBed.createComponent(TimeLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
