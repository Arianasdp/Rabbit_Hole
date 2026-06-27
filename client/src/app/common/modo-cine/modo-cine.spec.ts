import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModoCine } from './modo-cine';

describe('ModoCine', () => {
  let component: ModoCine;
  let fixture: ComponentFixture<ModoCine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModoCine],
    }).compileComponents();

    fixture = TestBed.createComponent(ModoCine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
