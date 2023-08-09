import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSearchFormComponent } from './stock-search-form.component';

describe('StockSearchFormComponent', () => {
  let component: StockSearchFormComponent;
  let fixture: ComponentFixture<StockSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSearchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
