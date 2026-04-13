import { Component } from '@angular/core';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { MMainMenuComponent } from "../../m-framework/components/m-main-menu/m-main-menu.component";
import { FormsModule } from '@angular/forms';
import { MTimeseriesChartComponent } from "../../m-framework/components/m-timeserieschart/m-timeserieschart.component";
import { MTableComponent } from "../../m-framework/components/m-table/m-table.component";
import { MSearchButtonComponent } from "../../m-framework/components/m-search-button/m-search-button.component";
import { MAhaComponent } from '../../m-framework/components/m-aha/m-aha.component';
@Component({
  selector: 'app-cropguard',
  standalone: true,
  imports: [MContainerComponent, MMainMenuComponent, FormsModule, MTimeseriesChartComponent, MTableComponent, MSearchButtonComponent,MAhaComponent],
  templateUrl: './cropguard.component.html',
  styleUrl: './cropguard.component.css'
})
export class CropguardComponent {
  activeSelection: string = 'Log Reading';
  dateValue: string = '';
  phValue: number = 0;
  moistureValue: number = 0;
  phReadings: {date:string, value:number}[] = [];
  moistureReadings: {date:string, value:number}[] = [];
  filterTerm: string = '';
  validationError: string = '';
  showAlerts: boolean = false;
  private alertTimer: any;

  constructor(){
    
    const ph = localStorage.getItem('phValues');
    this.phReadings = ph ? JSON.parse(ph):[];
    const moisture = localStorage.getItem('moistureValues');
    this.moistureReadings = moisture ? JSON.parse(moisture):[];
  }
  onMenuClick(item: any){
    this.activeSelection = item;

  }

  updateReading(
    readings: {date: string, value:number}[],
    date: string,
    value: number):{date: string, value: number}[]{

    
      let filtered = readings.filter(r => r.date != date);
  

      filtered.push({date,value});


   

      return filtered.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());


  }

  isValid(): boolean{
    if(!this.dateValue){
      this.validationError = " Please Select a Date ";
      return false;
    }
    if(isNaN(this.phValue) || this.phValue <0 || this.phValue >14){
      this.validationError = "pH value should be between 0 and 14"
      return false
    }
    if(isNaN(this.moistureValue) || this.moistureValue <0 || this.moistureValue >100){
      this.validationError = "Moisture value should be between 0 and 100"
      return false
    }
    this.validationError = "";
    return true
  }
  saveReading(){
    if(this.isValid()){
    
    this.phReadings = this.updateReading(this.phReadings,this.dateValue,this.phValue);
    
    localStorage.setItem('ph_value',JSON.stringify(this.phReadings));

    this.moistureReadings = this.updateReading(this.moistureReadings,this.dateValue,this.moistureValue);

    localStorage.setItem('moisture_value',JSON.stringify(this.moistureReadings));
    }

    this.showAlerts = true;

    if (this.alertTimer) clearTimeout(this.alertTimer);

    this.alertTimer = setTimeout(() => {
      this.showAlerts = false;
    }, 3000);
  }

  getLatest(readings: { date: string, value: number }[]) {
    return readings.length > 0
      ? readings[readings.length - 1].value : null;
  }

  isPhAlert(): boolean {
    const v = this.getLatest(this.phReadings);
    return v !== null && (v < 5.5 || v > 7.5);
  }

  isMoistureAlert(): boolean {
    const v = this.getLatest(this.moistureReadings);
    return v !== null && (v < 20 || v > 80);
  }
}

