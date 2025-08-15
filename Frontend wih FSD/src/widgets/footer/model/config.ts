interface DisplayConfig {
  showLogo: boolean;
  showTagline: boolean;
  showNavigation: boolean;
  showContacts: boolean;
  showSocial: boolean;
  showCopyright: boolean;
  showLegalLinks: boolean;
}

interface StylesConfig {
  backgroundColor: string;
  padding: string;
  marginTop: string;
}

interface ResponsiveConfig {
  mobileBreakpoint: string;
  tabletBreakpoint: string;
}

interface FooterConfig {
  tagline: string;
  display: DisplayConfig;
  styles: StylesConfig;
  responsive: ResponsiveConfig;
}

export const footerConfig: FooterConfig = {
  tagline: 'Для хендмейдеров и творческих людей',
  
  display: {
    showLogo: true,
    showTagline: true,
    showNavigation: true,
    showContacts: true,
    showSocial: true,
    showCopyright: true,
    showLegalLinks: true
  },
  
  styles: {
    backgroundColor: '#f5f5f5',
    padding: '50px 0 20px',
    marginTop: '60px'
  },
  
  responsive: {
    mobileBreakpoint: '768px',
    tabletBreakpoint: '1024px'
  }
};