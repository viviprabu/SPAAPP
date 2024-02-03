import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlottimingComponent } from './slottiming.component';

describe('SlottimingComponent', () => {
  let component: SlottimingComponent;
  let fixture: ComponentFixture<SlottimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlottimingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlottimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
