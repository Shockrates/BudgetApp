import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdTableCardComponent } from './household-table-card.component';

describe('HouseholdTableCardComponent', () => {
  let component: HouseholdTableCardComponent;
  let fixture: ComponentFixture<HouseholdTableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdTableCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
