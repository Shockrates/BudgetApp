import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdCreationComponent } from './household-creation.component';

describe('HouseholdCreationComponent', () => {
  let component: HouseholdCreationComponent;
  let fixture: ComponentFixture<HouseholdCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
