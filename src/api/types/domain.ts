export interface DomainOwner {
  id: number;
  username: string;
  email: string;
  passwordHash?: string;
  role: string;
  createdAt: string;
  site: string | null;
}

export interface Domain {
  domainName: string;
  regionId: string;
  owner: DomainOwner;
  price: number;
  currency: string;
  renewalPrice: number;
  hasMarketplace: boolean;
}

// Dashboard types
export interface DomainTld {
  name: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
}

export interface DomainEntry {
  name: string;
  status: string;
  expirationDate: string;
  tld: string;
  cost: number;
  available: boolean;
}

export interface DomainSubdomain {
  name: string;
  target: string;
  type: string;
}

export interface DomainDashboard {
  tlds: DomainTld[];
  domains: DomainEntry[];
  selectedDomain: string;
  subdomains: DomainSubdomain[];
  mode: string;
}

export interface DomainCheckRequest {
  domain: string;
}

export interface DomainCheckResponse {
  available: boolean;
  suggestions: string[];
  error?: string;
  registrationPrice: number;
  currency: string;
}
