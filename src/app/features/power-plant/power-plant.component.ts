import { Component } from '@angular/core';
import { MContainerComponent } from '../../m-framework/components/m-container/m-container.component';
import { MFormUlaComponent } from "../../m-framework/components/m-form-ula/m-form-ula.component";
import { FormsModule } from '@angular/forms';
import { MAhaComponent } from '../../m-framework/components/m-aha/m-aha.component';
import { MResultBoxComponent } from '../../m-framework/components/m-result-box/m-result-box.component';
@Component({
  selector: 'app-power-plant',
  standalone: true,
  imports: [MContainerComponent, MFormUlaComponent,FormsModule,MAhaComponent,MResultBoxComponent],
  templateUrl: './power-plant.component.html',
  styleUrl: './power-plant.component.css'
})
export class PowerPlantComponent {
loadPercent: number=0;
ratedCapacity: number=0;
currentLoad: number=0;
calculated: boolean=false;
fuelType: string='coal';

calculate(){
  this.loadPercent = Math.min(100,(this.currentLoad/this.ratedCapacity)*100);
  this.calculated = true;
}



getCondition(value: number): string {
    
  if (value < 40) {
    return 'warning';
  } else if (value <= 70) {
    return 'success';
  } else {
    return 'error';
  }

}
}
