export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function setUser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): any {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem('user');
}

