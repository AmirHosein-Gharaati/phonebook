import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactDetailComponent } from './modules/home/components/contact-detail/contact-detail.component';
import { AddComponent } from './modules/home/pages/add/add.component';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
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
  {
    path: '**',
    redirectTo: 'not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
