import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactDetailComponent } from './modules/home/components/contact-detail/contact-detail.component';
import { AddComponent } from './modules/home/pages/add/add.component';
import { HomeComponent } from './modules/home/pages/home/home.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: ':id',
        component: ContactDetailComponent,
      },
      {
        path: ':id/edit',
        component: AddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
