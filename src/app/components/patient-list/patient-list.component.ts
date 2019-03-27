import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { CanDeactivateGuard } from '../../can-deactivate-guard.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, CanDeactivateGuard {

  public patients: Patient[] = [];

  public deleteCache: Patient[] = [];
  public isUndoActive: boolean = false;
  public undoTimer = null;

  public isAsc: boolean = true;
  public sortProperty: string = 'patientId';

  constructor(private patientService: PatientService, private flashMessageService: FlashMessagesService) { }

  ngOnInit() {
    this.patients = this.patientService.getAllPatients();
    this.patientService.patientsStream.subscribe(
      (patients: Patient[]) => {
        this.patients = patients;
      }
    );
  }

  onDeletePatient(patientID: number) {
    this.patientService.deletePatient(patientID);
  }

  parkForDelete(index: number) {
    this.isUndoActive = true;
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => {
      this.isUndoActive = false;
      this.processDeleteCache();
    }, 5 * 1000);
    let patient = this.patients[index];
    this.patients.splice(index, 1);
    this.deleteCache.unshift(patient);
  }

  processDeleteCache() {
    let deletePatientsCount = this.deleteCache.length;
    this.patientService.deletePatients(this.deleteCache);
    this.deleteCache = [];
    this.flashMessageService.show(
      `<div class="alert alert-danger">
        Deleted ${deletePatientsCount} patients.
       </div>`
    );
  }

  undoDelete() {
    clearTimeout(this.undoTimer);
    this.isUndoActive = false;
    this.patients = this.patients.concat(this.deleteCache);
    this.deleteCache = [];
  }

  setSortProperty(prop: string) {
    if (this.sortProperty === prop) {
      this.isAsc = !this.isAsc;
    }
    else {
      this.isAsc = true;
      this.sortProperty = prop;
    }

  }

  canDeactivate() {
    if (this.isUndoActive) {
      return confirm("You can not undo if you leave the page. Do you still want to proceed?");
    }
    return true;
  }

}
