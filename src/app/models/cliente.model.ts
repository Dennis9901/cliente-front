export interface Cliente {
  representante_legal: any;
  id: number;
  razonSocial: string;
  tipoPersona: 'Física' | 'Moral';
  rfc: string;
  representante: string;
  email: string;
  telefono: string;
  documento: string;
}
