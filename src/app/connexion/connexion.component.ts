import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
})
export class ConnexionComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<{message?: string, idRole?: string, error?: string}>('http://localhost:8081/api/auth/connexion', loginData)
      .subscribe({
        next: (response) => {
          if (response.message) {
            console.log('Connexion réussie', response.message);
            
            // Vérifier le rôle et rediriger en fonction
            if (response.idRole === '1') {
              this.router.navigate(['/dashboard']); // Rediriger vers la page Dashboard pour les administrateurs
            } else if (response.idRole === '2') {
              this.router.navigate(['/dashboard']); // Rediriger vers la page d'accueil pour les visiteurs
            } else {
              this.errorMessage = "Rôle inconnu. Veuillez contacter l'administrateur.";
            }
          } else if (response.error) {
            this.errorMessage = response.error;
          }
        },
        error: (error) => {
          console.error('Erreur de connexion', error);
          if (error.status === 401) {
            this.errorMessage = "Identifiants incorrects";
          } else {
            this.errorMessage = "Une erreur s'est produite lors de la tentative de connexion.";
          }
        },
        complete: () => {
          console.log('Requête de connexion complétée');
        }
      });
  }
}

