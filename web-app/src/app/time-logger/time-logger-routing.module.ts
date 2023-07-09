import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeLoggerComponent } from './time-logger.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo(['/']);

const routes: Routes = [
  {
    path: '',
    component: TimeLoggerComponent,
    ...canActivate(redirectUnauthorizedToHome), // ログインしていない場合はhomeにリダイレクト
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeLoggerRoutingModule {}
