import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdLayoutComponent } from './household-layout.component';

describe('HouseholdLayoutComponent', () => {
  let component: HouseholdLayoutComponent;
  let fixture: ComponentFixture<HouseholdLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
