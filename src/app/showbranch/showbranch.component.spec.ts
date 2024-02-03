import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowbranchComponent } from './showbranch.component';

describe('ShowbranchComponent', () => {
  let component: ShowbranchComponent;
  let fixture: ComponentFixture<ShowbranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowbranchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowbranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
