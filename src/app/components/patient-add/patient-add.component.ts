import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styleUrls: ['./patient-add.component.css']
})
export class PatientAddComponent implements OnInit {

  patientAddForm: FormGroup;
  
  constructor(private patientService: PatientService, private flashMessageService: FlashMessagesService) { }

  ngOnInit() {
    this.patientAddForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'dob': new FormControl(null, [Validators.required,this.dobValidator])
    });
  }

  onSubmit(){
    let patient:Patient = new Patient(
                        null,
                        this.patientAddForm.get('name').value,
                        new Date(this.patientAddForm.get('dob').value),
                      );
    this.patientService.addPatient(patient);
    this.flashMessageService.show(
      `<div class="alert alert-success">
        Patient Added!
       </div>`
    );
  }


  dobValidator(control: FormControl):{[s:string]:boolean}{
    try{
      let dob = new Date(control.value);
      if(!Patient.isFutureDate(dob)){
        return null;
      }
    }
    catch(err){
      
    }
    return {'dobInvalid':true};
  }

}
