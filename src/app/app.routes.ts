import { Routes } from '@angular/router';
import { ComprovanteComponent } from './views/comprovante/comprovante.component';

export const routes: Routes = [
  { path: 'comprovante', component: ComprovanteComponent },
  { path: '', redirectTo: 'comprovante', pathMatch: 'full' },
  { path: '**', redirectTo: 'comprovante' },
];
