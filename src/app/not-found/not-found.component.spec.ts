import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFound } from './not-found.component';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFound ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
