import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent {
  activationCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const activationData = {
      code: this.activationCode
    };

    // Effectuer la requête POST pour l'activation
    this.http.post<{ message?: string, error?: string }>('http://localhost:8081/api/auth/activation', activationData)
      .subscribe({
        next: (response) => {
          // Vérifie d'abord que la réponse est définie avant d'accéder aux propriétés
          if (response) {
            if (response.message) {
              this.successMessage = 'Votre compte a été activé avec succès !';
              this.router.navigate(['/connexion']);
            } else if (response.error) {
              this.errorMessage = response.error;
            } else {
              // Si la réponse ne contient ni message ni erreur
              this.errorMessage = "Réponse inattendue du serveur.";
            }
          }
        },
        error: (error) => {
          // Enregistre l'erreur dans la console et affiche un message générique à l'utilisateur
          console.error('Erreur lors de l\'activation du compte', error);
          this.errorMessage = "Une erreur s'est produite lors de l'activation. Veuillez réessayer.";
        }
      });
  }
}

