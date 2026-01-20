export interface CertificationDomain {
  name: string;
  options: string[];
}

export interface CertificationData {
  domains: CertificationDomain[];
}
