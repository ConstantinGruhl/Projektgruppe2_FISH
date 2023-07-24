import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeBlockerComponent } from './time-blocker.component';

describe('TimeBlockerComponent', () => {
  let component: TimeBlockerComponent;
  let fixture: ComponentFixture<TimeBlockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeBlockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
