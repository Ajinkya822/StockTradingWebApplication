import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalFirstTabComponent } from './historical-first-tab.component';

describe('HistoricalFirstTabComponent', () => {
  let component: HistoricalFirstTabComponent;
  let fixture: ComponentFixture<HistoricalFirstTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalFirstTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalFirstTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
