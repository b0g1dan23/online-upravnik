import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIssues } from './all-issues';

describe('AllIssues', () => {
  let component: AllIssues;
  let fixture: ComponentFixture<AllIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
