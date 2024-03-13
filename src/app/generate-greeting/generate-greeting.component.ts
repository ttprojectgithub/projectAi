// generate-greeting.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-greeting',
  templateUrl: './generate-greeting.component.html',
})
export class GenerateGreetingComponent {
  myForm: FormGroup;
  showAgeInput = false;
  showHobbiesInput = false;
  showJobInput = false;
  showAspirationsInput = false;
  typeOfGreets = ['Song', 'Long Letter', 'Short Letter'];
  eventTypes = ['Birthday', 'New Job'];
  greetings: string[] = [];
  selectedGreetingIndex = 0;
  showInputs = true;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      typeOfGreet: ['', Validators.required],
      atmosphere: ['', Validators.required],
      from: ['', Validators.required],
      eventType: ['', Validators.required],
      age: [''],
      hobbies: [''],
      job: [''],
      aspirations: [''],
    });
  }

  onEventTypeChange() {
    const eventTypeControl = this.myForm.get('eventType');

    if (eventTypeControl) {
      const eventType = eventTypeControl.value;

      this.showAgeInput = false;
      this.showHobbiesInput = false;
      this.showJobInput = false;
      this.showAspirationsInput = false;

     
      if (eventType === 'Birthday') {
        this.showAgeInput = true;
        this.showHobbiesInput = true;
      } else if (eventType === 'New Job') {
        this.showJobInput = true;
        this.showAspirationsInput = true;
      }
    }
  }

  createGreeting() {
    if (!this.myForm.valid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    this.showInputs = false;
    const formData = this.extractFormData();
    this.sendFormData(formData);
  }
  
  private markFormFieldsAsTouched() {
    ['name', 'typeOfGreet', 'atmosphere', 'from', 'eventType'].forEach(field => {
      this.myForm.get(field)?.markAsTouched();
    });
  }
  
  private extractFormData() {
    return {
      event: this.myForm.get('eventType')?.value,
      name: this.myForm.get('name')?.value,
      typeOfGreet: this.myForm.get('typeOfGreet')?.value,
      atmosphere: this.myForm.get('atmosphere')?.value,
      from: this.myForm.get('from')?.value,
      details: {
        age: this.myForm.get('age')?.value,
        favoriteHobbies: this.myForm.get('hobbies')?.value,
        job: this.myForm.get('job')?.value,
        aspirations: this.myForm.get('aspirations')?.value,
      },
    };
  }
  
  private sendFormData(formData: any) {
    this.greetings = ["waiting to response..."];
    this.selectedGreetingIndex = 0;
  
    this.http.post<any>('http://localhost:3000/generateGreeting', formData).subscribe(response => {
      console.log(response, response.greetings);
      this.greetings = response.greetings;
      this.selectedGreetingIndex = 0;
    });
  }
  
  

  changeGreeting() {
    this.selectedGreetingIndex = (this.selectedGreetingIndex + 1) % this.greetings.length;
  }

}
