import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignEmployee } from './reassign-employee';

describe('ReassignEmployee', () => {
  let component: ReassignEmployee;
  let fixture: ComponentFixture<ReassignEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReassignEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
