import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  // private messageSource = new Subject<Employee>();
  private employee$ = new BehaviorSubject<any>({});
  selectedEmployee$ = this.employee$.asObservable();

  constructor() { }

  setMessage(data: Employee) {
    this.employee$.next(data);
  }

  // public getMessage(): Observable<Employee> {
  //   return this.messageSource.asObservable();
  // }

  // public setMessage(message: Employee) {
  //   return this.messageSource.next(message);
  // }
}
