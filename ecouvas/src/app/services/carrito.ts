import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  public items: any[] = []; 
  // Variables estáticas para que Angular no falle al mostrar el número
  public totalKilos: number = 0;
  public totalCosto: number = 0;

  constructor(public authService: AuthService) { }

  private normalizarNumero(valor: any): number {
    return Number(valor) || 0;
  }

  public obtenerPrecioDescuento(precioBase: number): number {
    if (this.authService.isLoggedIn()) {
      return precioBase * 0.85; // 15% VIP discount
    }
    return precioBase;
  }

  agregarAlCarrito(producto: any, cantidad: number) {
    let itemExistente = this.items.find(i => i.id === producto.id);
    
    // Aseguramos que la cantidad sea un número para evitar errores matemáticos
    let cantNum = this.normalizarNumero(cantidad);
    let precioBaseNum = this.normalizarNumero(producto.precio);

    if (itemExistente) {
      itemExistente.cantidad = this.normalizarNumero(itemExistente.cantidad) + cantNum;
      itemExistente.precioBase = precioBaseNum;
    } else {
      this.items.push({ ...producto, precioBase: precioBaseNum, cantidad: cantNum });
    }
    
    this.actualizarTotales();
  }

  eliminarItem(index: number) {
    this.items.splice(index, 1);
    this.actualizarTotales();
  }

  // Esta función actualiza la "burbuja" roja y el dinero total al instante
  public actualizarTotales() {
    this.totalKilos = this.items.reduce((sum, item) => sum + this.normalizarNumero(item.cantidad), 0);
    this.totalCosto = this.items.reduce(
      (sum, item) => sum + (this.obtenerPrecioDescuento(this.normalizarNumero(item.precioBase)) * this.normalizarNumero(item.cantidad)),
      0
    );
  }
}
