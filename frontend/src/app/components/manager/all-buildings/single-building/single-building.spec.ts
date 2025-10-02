import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBuilding } from './single-building';

describe('SingleBuilding', () => {
  let component: SingleBuilding;
  let fixture: ComponentFixture<SingleBuilding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleBuilding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleBuilding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
