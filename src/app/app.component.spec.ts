/* tslint:disable: max-line-length */
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home.component';
import { NotFound404Component } from './not-found404.component';
import { routes } from './app.routing';
import { StoreDevToolsModule } from './features/store-devtools.module';

import 'rxjs/add/operator/takeUntil';

describe('App Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
        StoreDevToolsModule
        ],
      providers: [],
      declarations: [AppComponent, HomeComponent, NotFound404Component]
    });
  });

  it('should contain app text', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement).toContainText('Angular Starter App');
  }));

});
