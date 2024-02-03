import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMinimizedComponent } from './sidebar-minimized.component';

describe('SidebarMinimizedComponent', () => {
  let component: SidebarMinimizedComponent;
  let fixture: ComponentFixture<SidebarMinimizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarMinimizedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarMinimizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
