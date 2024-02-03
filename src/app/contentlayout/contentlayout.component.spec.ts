import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentlayoutComponent } from './contentlayout.component';

describe('ContentlayoutComponent', () => {
  let component: ContentlayoutComponent;
  let fixture: ComponentFixture<ContentlayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentlayoutComponent]
    });
    fixture = TestBed.createComponent(ContentlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
