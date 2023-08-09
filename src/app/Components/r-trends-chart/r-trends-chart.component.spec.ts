import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTrendsChartComponent } from './r-trends-chart.component';

describe('RTrendsChartComponent', () => {
  let component: RTrendsChartComponent;
  let fixture: ComponentFixture<RTrendsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RTrendsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RTrendsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
