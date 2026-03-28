import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CarritoService } from './services/carrito'; 
import { AuthService } from './services/auth.service';
import { Toast } from './components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [CommonModule, Toast, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  uvas: any[] = [];
  isCartOpen = false;
  isAuthModalOpen = false;
  authMode: 'login' | 'register' = 'login';
  
  // Auth Form Models
  loginEmail = '';
  loginPassword = '';
  regName = '';
  regEmail = '';
  regPassword = '';
  
  // Ruteo Interno & Mocks Dashboard
  currentView: 'store' | 'dashboard' = 'store';
  mockKpis = { totales: 12, kilos: 45, ahorro: 115.50 };
  mockPedidos = [
    { id: 'PED-004', fecha: '25/03/2026', estado: 'En Transito', total: 68.00 },
    { id: 'PED-003', fecha: '20/03/2026', estado: 'Entregado', total: 120.50 },
    { id: 'PED-002', fecha: '15/03/2026', estado: 'Entregado', total: 45.00 },
    { id: 'PED-001', fecha: '02/03/2026', estado: 'Entregado', total: 85.20 }
  ];
  mockGrafico = [
    { mes: 'Nov', valor: 18.50 },
    { mes: 'Dic', valor: 32.00 },
    { mes: 'Ene', valor: 12.00 },
    { mes: 'Feb', valor: 68.50 },
    { mes: 'Mar', valor: 25.20 }
  ];

  obtenerMaximoAhorro(): number {
    // Retorna el valor más alto o un mínimo de 50 para la escala.
    return Math.max(...this.mockGrafico.map(m => m.valor), 50);
  }
  uvaSeleccionadaParaModal: any = null; 
  kilosModal: number = 1; 
  isDarkMode = false;

  @ViewChild(Toast) toast!: Toast;

  constructor(
    private http: HttpClient,
    public carritoService: CarritoService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarTemaGuardado();
    this.http.get('/api/uvas').subscribe((datos: any) => {
      this.uvas = datos;
    });
  }

  cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem('theme');
    this.isDarkMode = temaGuardado === 'dark';
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleAuthModal() {
    this.isAuthModalOpen = !this.isAuthModalOpen;
    if (this.isAuthModalOpen) {
      this.authMode = 'login';
      this.loginEmail = '';
      this.loginPassword = '';
      this.regName = '';
      this.regEmail = '';
      this.regPassword = '';
    }
  }

  navigateTo(view: 'store' | 'dashboard') {
    this.currentView = view;
    this.isAuthModalOpen = false; // Cierra modal al navegar
  }

  cambiarModoAuth(modo: 'login' | 'register') {
    this.authMode = modo;
  }

  iniciarSesion() {
    if (this.authService.login(this.loginEmail, this.loginPassword)) {
      this.toast.show('Sesion iniciada correctamente. Descuentos VIP activados.');
      this.toggleAuthModal();
      this.carritoService.actualizarTotales();
    } else {
      this.toast.show('Credenciales incorrectas');
    }
  }

  registrarUsuario() {
    if (!this.regName || !this.regEmail || !this.regPassword) {
      this.toast.show('Completa todos los campos');
      return;
    }
    if (this.authService.register(this.regName, this.regEmail, this.regPassword)) {
      this.toast.show('Cuenta creada exitosamente. Bienvenido a VIP.');
      this.toggleAuthModal();
      this.carritoService.actualizarTotales();
    } else {
      this.toast.show('El correo ya esta en uso');
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.toast.show('Sesion cerrada. Hasta pronto.');
    this.carritoService.actualizarTotales();
    this.navigateTo('store'); // Return to store on logout securely
  }

  abrirModal(uva: any) {
    this.uvaSeleccionadaParaModal = uva; 
    this.kilosModal = 1; 
  }

  cerrarModal() {
    this.uvaSeleccionadaParaModal = null; 
  }

  restarKilosModal() {
    if (this.kilosModal > 1) {
      this.kilosModal--;
    }
  }

  sumarKilosModal() {
    this.kilosModal++;
  }

  obtenerPrecioRegular(producto: any): number {
    return Number(producto?.precio) || 0;
  }

  obtenerPrecio(producto: any): number {
    let precio = this.obtenerPrecioRegular(producto);
    if (this.authService.isLoggedIn()) {
      return precio * 0.85; // 15% VIP discount
    }
    return precio;
  }

  obtenerTotalModal(): number {
    if (!this.uvaSeleccionadaParaModal) {
      return 0;
    }

    return this.obtenerPrecio(this.uvaSeleccionadaParaModal) * this.kilosModal;
  }

  confirmarAgregarAlCarrito() {
    if (this.uvaSeleccionadaParaModal) {
      this.carritoService.agregarAlCarrito(this.uvaSeleccionadaParaModal, this.kilosModal);
      this.toast.show(`Agregado: ${this.kilosModal} kg de ${this.uvaSeleccionadaParaModal.nombre}`);
      this.cerrarModal(); 
    }
  }

  toggleCarrito() {
    this.isCartOpen = !this.isCartOpen;
  }
}
