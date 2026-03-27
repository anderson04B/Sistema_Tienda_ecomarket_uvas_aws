import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private usersDb: User[] = [];

  constructor() {
    this.loadUsers();
    this.loadSession();
  }

  private loadUsers() {
    const data = localStorage.getItem('ecouvas_users_db');
    if (data) {
      try {
        this.usersDb = JSON.parse(data);
      } catch (e) {
        this.usersDb = [];
      }
    }
  }

  private loadSession() {
    const activeUserId = localStorage.getItem('ecouvas_active_session_id');
    if (activeUserId) {
      const user = this.usersDb.find(u => u.id === activeUserId);
      if (user) {
        this.currentUser = { id: user.id, name: user.name, email: user.email };
      }
    }
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public login(email: string, password: string): boolean {
    const user = this.usersDb.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem('ecouvas_active_session_id', user.id);
      return true;
    }
    return false;
  }

  public register(name: string, email: string, password: string): boolean {
    const exists = this.usersDb.find(u => u.email === email);
    if (exists) {
      return false; // Email ya registrado
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    this.usersDb.push(newUser);
    localStorage.setItem('ecouvas_users_db', JSON.stringify(this.usersDb));
    // Auto-login post registro
    this.login(email, password);
    return true;
  }

  public logout(): void {
    this.currentUser = null;
    localStorage.removeItem('ecouvas_active_session_id');
  }
}
