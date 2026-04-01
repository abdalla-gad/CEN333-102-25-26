import { Component } from '@angular/core';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { MMainMenuComponent } from "../../m-framework/components/m-main-menu/m-main-menu.component";
import { FormsModule } from '@angular/forms';
import { MTimeseriesChartComponent } from "../../m-framework/components/m-timeserieschart/m-timeserieschart.component";
@Component({
  selector: 'app-cropguard',
  standalone: true,
  imports: [MContainerComponent, MMainMenuComponent, FormsModule, MTimeseriesChartComponent],
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

  constructor(){
    
    const ph = localStorage.getItem('ph_value');
    this.phReadings = ph ? JSON.parse(ph):[];
    const moisture = localStorage.getItem('moisture_value');
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
  saveReading(){
    
    this.phReadings = this.updateReading(this.phReadings,this.dateValue,this.phValue);
    
    localStorage.setItem('ph_value',JSON.stringify(this.phReadings));

    this.moistureReadings = this.updateReading(this.moistureReadings,this.dateValue,this.moistureValue);

    localStorage.setItem('moisture_value',JSON.stringify(this.moistureReadings));

  }
}

