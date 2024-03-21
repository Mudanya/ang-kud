import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { CustomPreloadService } from './custom-preload.service';

const appRoutes:Routes = [
  {path:'home',component:HomeComponent},
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'employees',data:{preload:true},loadChildren:()=>import('./employee/employee.module').then(m => m.EmployeeModule)},
  {path:'**',component:PageNotFoundComponent}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,{preloadingStrategy:CustomPreloadService})
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
