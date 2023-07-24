import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRequestComponent } from './play-request.component';

describe('PlayRequestComponent', () => {
  let component: PlayRequestComponent;
  let fixture: ComponentFixture<PlayRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
