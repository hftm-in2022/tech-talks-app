import { Routes } from '@angular/router';
import { TechTalkListComponent } from './tech-talk-list/tech-talk-list.component';
import { TechTalkDetailComponent } from './tech-talk-detail/tech-talk-detail.component';

export const routes: Routes = [
  { path: 'talks', component: TechTalkListComponent },
  { path: 'talk/:id', component: TechTalkDetailComponent },
  { path: '', redirectTo: '/talks', pathMatch: 'full' },
];
