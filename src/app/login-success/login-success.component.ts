import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.component.html',
  styleUrl: './login-success.component.scss',
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.authService.checkAuth();
    this.router.navigate(['/home'], { queryParams: { page: 1 } });
  }
}
