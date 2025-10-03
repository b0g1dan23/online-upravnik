import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAllIssues } from './tenant-all-issues';

describe('TenantAllIssues', () => {
  let component: TenantAllIssues;
  let fixture: ComponentFixture<TenantAllIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantAllIssues]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantAllIssues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
