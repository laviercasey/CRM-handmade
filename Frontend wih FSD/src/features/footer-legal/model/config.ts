interface LegalInfo {
  companyFullName: string
  inn: string | null
  kpp: string | null
  ogrn: string | null
  address: string
}

interface DocumentVersions {
  terms: string
  privacy: string
  cookies: string
}

interface LastUpdated {
  terms: string
  privacy: string
  cookies: string
}

interface LegalConfig {
  companyName: string
  foundedYear: number
  rightsText: string
  legalInfo: LegalInfo
  documentVersions: DocumentVersions
  lastUpdated: LastUpdated
}

export const legalConfig: LegalConfig = {
  companyName: 'ТвойCRM',
  foundedYear: 2024,
  rightsText: 'Все права защищены.',
  
  legalInfo: {
    companyFullName: 'ТвойCRM',
    inn: null,
    kpp: null,
    ogrn: null,
    address: 'Россия, Москва'
  },
  
  documentVersions: {
    terms: '1.0',
    privacy: '1.0',
    cookies: '1.0'
  },
  
  lastUpdated: {
    terms: '2024-01-01',
    privacy: '2024-01-01',
    cookies: '2024-01-01'
  }
}