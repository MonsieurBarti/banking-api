export interface CreateAccount {
  name: string;
}
export interface CreateAccountResponse {
  id_bank_account: string;
}
export interface UpdateService {
  name: string;
}
export interface CreateServiceResponse {
  public_key: string;
  secret_key: string;
}
export interface OperationIssuer {
  id_user?: string;
  id_service?: string;
}
