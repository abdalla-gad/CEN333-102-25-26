import { Component, ViewChild, ElementRef, viewChild } from '@angular/core';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { GeminiService } from '../../services/gemini.service';

interface circuitAnalysis {
  circuitType: string; 
  source: {type:string, value:number, unit:string};
  components: {
    id: string,
    type: string,
    value: number,
    unit: string
  }[];
  totals: {
    totalResistance: number,
    totalCurrent: number,
    totalPower:number
  };
  voltageDrops: {id:string, voltage:number}[];
  explanation: string;
  confidence: string;
  }

@Component({
  selector: 'app-schematicsnap',
  standalone: true,
  imports: [MContainerComponent],
  templateUrl: './schematicsnap.component.html',
  styleUrl: './schematicsnap.component.css'
})
export class SchematicsnapComponent {

  constructor(private gemini: GeminiService){}

  geminiResponse: circuitAnalysis | null = null;
  imagePreview: string = "";
  imageBase64: string ="";
  imageType: string = "";

  stream: MediaStream | null = null;
  @ViewChild('video') videoElement!:ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!:ElementRef<HTMLCanvasElement>;
  prompt = `You are an electrical circuit analyst. The image shows a circuit schematic. Analyze it and return a single JSON of this format:
  {
  circuitType: series | parallel | mixed; 
  source: {type: DC | AC, value: number, unit: V};
  components: [ {
    id: R1,
    type: resistor,
    value: number,
    unit: ohm
}
    ];
  totals: {
    totalResistance: number,
    totalCurrent: number,
    totalPower:number
  };
  voltageDrops: [{id:R1, voltage:number}];
  explanation: 2 to 4 sentences;
  confidence: high | medium | low;
  }

  the output must only be the json with no text at all.
  `
onImageCaptured(event:any){
  console.log("Function is called");
  const file: File =event.target.files[0];
  this.imageType = file.type;
  console.log(file);

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    console.log(this.imagePreview)
    this.imageBase64 = this.imagePreview.split(',')[1];
    console.log(this.imageBase64)
  };
  reader.readAsDataURL(file);
}

async analyzeImageButton(){
  const response = await this.gemini.analyzeImage(this.prompt,this.imageBase64,this.imageType);
  console.log(response);
  this.geminiResponse = JSON.parse(response);
  console.log(this.geminiResponse);
}

async startCam(){
  this.stream = await navigator.mediaDevices.getUserMedia({
    video: {facingMode: 'environment'}
  })
  console.log(this.videoElement);
  this.videoElement.nativeElement.srcObject = this.stream;
}

capturePhoto(){
  const video = this.videoElement.nativeElement;
  const canvas = this.canvasElement.nativeElement;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');

  ctx!.drawImage(video,0,0,canvas.width,canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg',0.9);
  this.imagePreview = dataUrl;
  this.imageBase64 = dataUrl.split(',')[1];
  this.imageType = 'image/jpeg';


}
stopCam(){

  this.stream!.getTracks().forEach(track => track.stop());
  this.stream = null;
}
}
