import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmojiComponent } from './list-emoji.component';

describe('ListEmojiComponent', () => {
  let component: ListEmojiComponent;
  let fixture: ComponentFixture<ListEmojiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEmojiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEmojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
