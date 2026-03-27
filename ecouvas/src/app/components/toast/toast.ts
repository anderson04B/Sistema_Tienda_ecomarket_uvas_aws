import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  template: `
    <div class="toast-container" [class.show]="_show">
      <div class="toast-content">
        <i class="toast-icon">🍇</i>
        <span class="toast-message">{{ _message }}</span>
      </div>
    </div>
  `,
  styleUrl: './toast.css'
})
export class Toast implements OnInit, OnDestroy {
  // Variables privadas para controlar el estado y el mensaje
  _show = false;
  _message = '';
  private timer: any;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    // Limpiamos el timer si el componente se destruye
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  // Función pública para mostrar el toast con un mensaje
  show(message: string, duration: number = 3000) {
    this._message = message;
    this._show = true;

    // Limpiamos el timer anterior si hay uno
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Ocultamos el toast después de la duración especificada
    this.timer = setTimeout(() => {
      this._show = false;
    }, duration);
  }
}