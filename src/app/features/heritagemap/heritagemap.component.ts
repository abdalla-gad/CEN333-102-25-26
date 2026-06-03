import { Component, ViewChild } from '@angular/core';
import { MContainerComponent } from "../../m-framework/components/m-container/m-container.component";
import { GoogleMap, MapMarker, MapInfoWindow, MapPolyline } from '@angular/google-maps';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
@Component({
  selector: 'app-heritagemap',
  standalone: true,
  imports: [MContainerComponent, GoogleMap, MapMarker, MapInfoWindow,FormsModule, MapPolyline],
  templateUrl: './heritagemap.component.html',
  styleUrl: './heritagemap.component.css'
})
export class HeritagemapComponent {

  routePath: {lat:number, lng:number}[] = [];
  explaining: boolean = false;
  sites = [
    {
      name: 'Qasr Al Hosn',
      category: 'Fort',
      era: 'Pre-Islamic',
      lat: 24.4707,
      lng: 54.3697,
      description: ''
    },
    {
      name: 'Sheikh Zayed Grand Mosque',
      category: 'Mosque',
      era: 'Modern',
      lat: 24.4128,
      lng: 54.4748,
      description: ''
    },
    {
      name: 'Louvre Abu Dhabi',
      category: 'Museum',
      era: 'Modern',
      lat: 24.5347,
      lng: 54.3982,
      description: ''
    },
    {
      name: 'Qasr Al Watan',
      category: 'Palace',
      era: 'Modern',
      lat: 24.4644,
      lng: 54.3414,
      description: ''
    }
  ];

  newSiteName: string="";
  newEra: string="";
  newCategory: string="";
  newLat:number=0;
  newLng:number=0;

siteSelected: any;
mapCenter = {lat:24.4539, lng:54.3773};
mapZoom=12;
mapOptions = {
  mapTypeId: 'roadmap',
}

constructor(private gemini: GeminiService){}
ngOnInit(){
  this.catureUserLocation();
}

@ViewChild(MapInfoWindow) infoWindow!:MapInfoWindow;

heatMapPoints: any[]=[];
showHeatMap: boolean = false;


private overlay = new GoogleMapsOverlay({});

onMapReady(map: google.maps.Map) {
  this.overlay.setMap(map);   // attach deck.gl to the Google map
  this.buildHeatMap();
}

buildHeatMap() {
  console.log("building heatmap")
  const points = this.sites.map(site => ({
    position: [site.lng, site.lat],  
    weight: 1
  }));

  const heatmap = new HeatmapLayer({
    id: 'heatmap',
    data: points,
    getPosition: (d: any) => d.position,
    getWeight: (d: any) => d.weight,
    radiusPixels: 30,   
    opacity: 0.7,
  });

  this.overlay.setProps({ layers: [heatmap] });
  this.showHeatMap = true;
}
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
catureUserLocation(){
  navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    this.mapCenter = {lat:position.coords.latitude, lng:position.coords.longitude};
  })
}
getMarkerColor(category: string): string{
  if(category==="Fort") return "#c62828";
  if(category==="Museum") return "#2e7d32";
  if(category==="Mosque") return "#f9a825";
  if(category==="Palace") return "#1565c0";
  return "#000000"

}

onMarkerClick(site: any, marker:MapMarker){
  this.siteSelected = site;
  this.infoWindow.open(marker);
}

addSite(){
  this.sites.push(
    {
      name:this.newSiteName,
      category: this.newCategory,
      era: this.newEra,
      lat: this.newLat,
      lng: this.newLng,
      description:''
    }
  )
  console.log(this.sites)
}

onMapClick(event: any){
  // console.log(event);
  this.newLat = event.latLng.lat();
  this.newLng = event.latLng.lng();
}

async explainSite(site:any){
  this.explaining = true;
  const prompt = `You are a cultural heritage guide. 
  Write a 3-sentence description of a visitor about the following heritage site:
  -Name: ${site.name}
  -Category: ${site.category}
  -Era: ${site.era}
  Keep the tone informative and accessible`;

  const description = await this.gemini.generateText(prompt);

  console.log(description);
  site.description = description;

  this.explaining = false;

}

async generateRouteToSite(site:any){
  this.routePath = [
    {lat: this.mapCenter.lat, lng: this.mapCenter.lng},
    {lat: site.lat, lng:site.lng},
    {lat: 24.4707, lng: 54.3697}
  ];
}
}
