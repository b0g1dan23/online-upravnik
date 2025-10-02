import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleIssue } from './single-issue';

describe('SingleIssue', () => {
  let component: SingleIssue;
  let fixture: ComponentFixture<SingleIssue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleIssue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleIssue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
