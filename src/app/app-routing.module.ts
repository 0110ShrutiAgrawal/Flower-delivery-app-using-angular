import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlowersComponent } from './components/flowers/flowers.component';
import { FlowerComponent } from './components/flower/flower.component';

const routes: Routes = [
  { path:'', redirectTo: '/flowers', pathMatch: 'full'},
  { path: 'flowers', component: FlowersComponent },
  { path: 'flowers/:id', component: FlowerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
