import { Component } from '@angular/core';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { GoogleMap } from '@angular/google-maps';
import { GeminiService } from '../../services/gemini.service';
@Component({
  selector: 'app-heritagemap',
  standalone: true,
  imports: [MContainerComponent,GoogleMap],
  templateUrl: './heritagemap.component.html',
  styleUrl: './heritagemap.component.css'
})
export class HeritagemapComponent {
mapCenter = {lat:24.4539, lng:54.3773};
mapZoom=12;
mapOptions = {
  mapTypeId: 'roadmap',
}

constructor(private gemini: GeminiService){}

async testGemini(){
  try{
    const reply = await this.gemini.generateText(
      'Say hello in three different languages, one per line'
    );
    alert(reply)
  }catch(err){
    alert(err)
  }
}
}
