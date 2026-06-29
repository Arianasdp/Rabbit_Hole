import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {

  authService = inject(AuthService);
  router = inject(Router);

  async ngOnInit() {

    // await new Promise(resolve => setTimeout(resolve, 1000));

    const autorizado = await this.authService.autenticarToken();

    if (autorizado) {
      this.router.navigateByUrl('/publicaciones');
    }
    else {
      this.router.navigateByUrl('/auth/login');
    }
  }
}
