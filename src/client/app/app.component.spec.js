var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var testing_1 = require('@angular/core/testing');
var common_1 = require('@angular/common');
var testing_2 = require('@angular/core/testing');
var testing_3 = require('@angular/router/testing');
var app_component_1 = require('./app.component');
var home_component_1 = require('./home/home.component');
var about_component_1 = require('./about/about.component');
var toolbar_component_1 = require('./shared/toolbar/toolbar.component');
var navbar_component_1 = require('./shared/navbar/navbar.component');
function main() {
    describe('App component', function () {
        var config = [
            { path: '', component: home_component_1.HomeComponent },
            { path: 'about', component: about_component_1.AboutComponent }
        ];
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [forms_1.FormsModule, testing_3.RouterTestingModule.withRoutes(config)],
                declarations: [TestComponent, toolbar_component_1.ToolbarComponent,
                    navbar_component_1.NavbarComponent, app_component_1.AppComponent,
                    home_component_1.HomeComponent, about_component_1.AboutComponent],
                providers: [
                    { provide: common_1.APP_BASE_HREF, useValue: '/' }
                ]
            });
        });
        it('should build without a problem', testing_2.async(function () {
            testing_1.TestBed
                .compileComponents()
                .then(function () {
                var fixture = testing_1.TestBed.createComponent(TestComponent);
                var compiled = fixture.nativeElement;
                expect(compiled).toBeTruthy();
            });
        }));
    });
}
exports.main = main;
var TestComponent = (function () {
    function TestComponent() {
    }
    TestComponent = __decorate([
        core_1.Component({
            selector: 'test-cmp',
            template: '<sd-app></sd-app>'
        })
    ], TestComponent);
    return TestComponent;
})();
//# sourceMappingURL=app.component.spec.js.map