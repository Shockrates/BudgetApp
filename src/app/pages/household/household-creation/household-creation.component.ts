import { Component, inject, output } from '@angular/core';
import { HouseholdLayoutComponent } from "../household-layout/household-layout.component";
import { FormWrapperComponent } from "../../../components/form-wrapper/form-wrapper.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HouseholdService } from '../../../services/household.service';
import { Household } from '../../../interfaces/models/household.interface';

@Component({
  selector: 'app-household-creation',
  imports: [FormWrapperComponent, ReactiveFormsModule],
  templateUrl: './household-creation.component.html',
  styleUrl: './household-creation.component.css'
})
export class HouseholdCreationComponent {

  private householdService = inject(HouseholdService);

  created = output<Household>();

  householdForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  addHousehold() {
    //console.log(this.householdForm.value.name);
    const name = this.householdForm.value.name
    this.householdService.createHousehold(name).subscribe({
      next: household => {
        if (household) {
          console.log("FROM COMPONENT: " + household.name);
          this.created.emit(household);
        }


      },
      error: err => {
        console.error(err.error.message);
      }
    })

  }

}
