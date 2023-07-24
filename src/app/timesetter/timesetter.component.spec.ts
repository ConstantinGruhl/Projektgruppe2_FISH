import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesetterComponent } from './timesetter.component';

describe('TimesetterComponent', () => {
  let component: TimesetterComponent;
  let fixture: ComponentFixture<TimesetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesetterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
