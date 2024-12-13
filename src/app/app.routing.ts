import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/Home/Home.component';

// import { AuthGuard } from './guards';
// import {
//     SearchGridCallComponent,
//     LoginComponent,
//     DashboardComponent,
//     PreferenceComponent
// } from '@app/components';


const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
  // {
  //   path: 'dashboard/:id',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard]
  // }, {
  //   path: 'preference/:id',
  //   component: PreferenceComponent,
  //   canActivate: [AuthGuard]
  // }, {
  //   path: 'search/result',
  //   component: SearchGridCallComponent,
  //   canActivate: [AuthGuard]
  // }, {
  //   path: 'search/result/:id',
  //   component: SearchGridCallComponent,
  //   canActivate: [AuthGuard]
  // }, {
  //   path: 'login',
  //   component: LoginComponent,
  //   outlet: 'system'
  // }, {
  //   path: '',
  //   redirectTo: 'dashboard/home',
  //   pathMatch: 'full'
  // }, {
  //   path: '**', redirectTo: 'dashboard/home'
  // }, {
  //   path: 'dashboard/home/**', redirectTo: 'dashboard/home'
  // }
];

export const routing = RouterModule.forRoot(appRoutes, { enableTracing: false });
