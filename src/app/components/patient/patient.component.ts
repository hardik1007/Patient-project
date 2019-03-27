import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  public patient: Patient = null;
  private patientID: number;

  constructor(private patientService:PatientService,private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.patient = null;
        this.patientID = +params['patientid'];
        this.patient = this.patientService.getPatient(this.patientID);
        if(this.patient == null){
          this.router.navigate(['/not-found']);
        } 
      }
    );
  }

}
