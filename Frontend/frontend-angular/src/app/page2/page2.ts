import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // para ngIf, pipes, etc.
import { FormsModule } from '@angular/forms';    // para ngModel

@Component({
  selector: 'app-page2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './page2.html',
  styleUrls: ['./page2.css']
})
export class Page2 {
  observacion = '';
  comentarioNuevo = '';
  nuevoMotivo = '';

  motivosDisponibles = ['Avería por vibración', 'Desgaste de componente', 'Fallo en el sistema de registro', 'Vandalismo', 'Fallo en fuente de alimentación' ];
  motivosSeleccionados: any[] = [];

  agregarMotivo() {
    if (!this.nuevoMotivo || !this.comentarioNuevo) {
      alert('Debes seleccionar un motivo y escribir un comentario.');
      return;
    }

    this.motivosSeleccionados.push({
      motivoTipoId: Math.floor(Math.random() * 100),
      nombre: this.nuevoMotivo,
      comentario: this.comentarioNuevo,
    });

    this.nuevoMotivo = '';
    this.comentarioNuevo = '';
  }

  eliminarMotivo(index: number) {
    this.motivosSeleccionados.splice(index, 1);
  }

  confirmarCierre() {
    if (!this.observacion || this.motivosSeleccionados.length === 0) {
      alert('Debes completar la observación y al menos un motivo.');
      return;
    }

    const body = {
      observacionCierre: this.observacion,
      motivos: this.motivosSeleccionados.map(m => ({
        motivoTipoId: m.motivoTipoId,
      })),
    };

    console.log('Simulación: datos enviados al backend', body);
    alert('Orden cerrada correctamente');

    this.observacion = '';
    this.motivosSeleccionados = [];
  }
}
