import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [FormsModule, NgIf, HttpClientModule], // Importation des modules nécessaires
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'] // Correction de styleUrl en styleUrls
})
export class InscriptionComponent {
  pseudo: string = '';
  email: string = '';
  mdp: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const inscriptionData = {
      pseudo: this.pseudo,
      email: this.email,
      mdp: this.mdp,
      idRole: {
        idRole: 2,
        libRole: "Visiteur"
      }
    };

    this.http.post<{message?: string, error?: string}>('http://localhost:8081/api/auth/inscription', inscriptionData)
      .subscribe({
        next: (response) => {
          console.log('Inscription réussie', response.message);
          this.router.navigate(['/activation'], { state: { email: this.email } });
        },
        error: (error) => {
          console.error('Erreur d\'inscription', error);
          if (error.status === 400) {
            this.errorMessage = "Veuillez vérifier les informations fournies.";
          } else {
            this.errorMessage = "Une erreur s'est produite lors de l'inscription.";
          }
        }
      });
  }
}
