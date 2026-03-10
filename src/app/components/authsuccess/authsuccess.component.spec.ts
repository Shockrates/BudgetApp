import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthsuccessComponent } from './authsuccess.component';

describe('AuthsuccessComponent', () => {
  let component: AuthsuccessComponent;
  let fixture: ComponentFixture<AuthsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthsuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
