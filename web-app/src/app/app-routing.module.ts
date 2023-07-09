import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // Home
  {
    path: '',
    component: HomeComponent,
    outlet: 'primary',
    pathMatch: 'prefix',
  },
  // Time Logger (遅延ロード)
  {
    path: 'room/:loggerId',
    loadChildren: () =>
      import('./time-logger/time-logger.module').then(
        (m) => m.TimeLoggerModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
