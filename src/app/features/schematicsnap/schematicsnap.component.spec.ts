import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchematicsnapComponent } from './schematicsnap.component';

describe('SchematicsnapComponent', () => {
  let component: SchematicsnapComponent;
  let fixture: ComponentFixture<SchematicsnapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchematicsnapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchematicsnapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
