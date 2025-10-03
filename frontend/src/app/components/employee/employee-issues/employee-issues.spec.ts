import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIssues } from './employee-issues';

describe('EmployeeIssues', () => {
  let component: EmployeeIssues;
  let fixture: ComponentFixture<EmployeeIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
