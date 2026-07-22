import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDialog } from './complete-dialog';

describe('CompleteDialog', () => {
  let component: CompleteDialog;
  let fixture: ComponentFixture<CompleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
