import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDashboardComponent } from './household-dashboard.component';

describe('HouseholdDashboardComponent', () => {
  let component: HouseholdDashboardComponent;
  let fixture: ComponentFixture<HouseholdDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
