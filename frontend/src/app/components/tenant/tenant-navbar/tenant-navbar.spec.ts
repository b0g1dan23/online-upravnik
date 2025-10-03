import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantNavbar } from './tenant-navbar';

describe('TenantNavbar', () => {
  let component: TenantNavbar;
  let fixture: ComponentFixture<TenantNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
