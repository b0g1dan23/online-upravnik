import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEmployee } from './single-employee';

describe('SingleEmployee', () => {
  let component: SingleEmployee;
  let fixture: ComponentFixture<SingleEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
