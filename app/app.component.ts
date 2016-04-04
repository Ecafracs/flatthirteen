import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {DashboardComponent} from './dashboard.component';
import {DonutComponent} from './donut.component';
import {DonutService} from './donut.service';

@Component({
    selector: 'tw-ctr',
    template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['Donut']">Donut</a>
    </nav>
    <router-outlet></router-outlet>
  `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [DonutService, ROUTER_PROVIDERS],
})
@RouteConfig([
    {path: '/dashboard', name: 'Dashboard', component: DashboardComponent, useAsDefault: true},
    {path: '/donut', name: 'Donut', component: DonutComponent},
])
export class AppComponent {
    public title = 'Angular 2 Tone Wheel';
}
