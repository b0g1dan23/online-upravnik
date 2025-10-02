import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBuildings } from './all-buildings';

describe('AllBuildings', () => {
  let component: AllBuildings;
  let fixture: ComponentFixture<AllBuildings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBuildings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllBuildings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
