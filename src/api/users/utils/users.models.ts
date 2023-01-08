export interface CreateUser {
  email: string;
  password: string;
  lastname: string;
  firstname: string;
  age: number;
}
export interface UpdateUser {
  email?: string;
  password?: string;
  lastname?: string;
  firstname?: string;
  age?: number;
}
