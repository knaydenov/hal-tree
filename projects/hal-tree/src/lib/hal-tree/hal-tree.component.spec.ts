import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HalTreeComponent } from './hal-tree.component';

describe('HalTreeComponent', () => {
  let component: HalTreeComponent;
  let fixture: ComponentFixture<HalTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HalTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HalTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
