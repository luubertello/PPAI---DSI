import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // para ngIf, pipes, etc.
import { FormsModule } from '@angular/forms';    // para ngModel

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page1.html',
  styleUrls: ['./page1.css']
})
export class Page1 {
  ordenesEmpleado: any[] = [];
  ordenSeleccionada: any = null;

  constructor(private router: Router) {}

  buscarEmpleado() {
    this.ordenesEmpleado = [
      {
        id: 1,
        numero: 'OI-001',
        fechaFinalizacion: new Date('2024-06-15'),
        estacion: 'Estación Norte',
        sismografo: 'SG-1001',
      },
      {
        id: 2,
        numero: 'OI-002',
        fechaFinalizacion: new Date('2024-06-18'),
        estacion: 'Estación Sur',
        sismografo: 'SG-2002',
      }
    ];
  }

  continuar() {
    if (!this.ordenSeleccionada) {
      alert('Debes seleccionar una orden');
      return;
    }
    localStorage.setItem('ordenSeleccionada', JSON.stringify(this.ordenSeleccionada));
    this.router.navigate(['/page2']);
  }
}
