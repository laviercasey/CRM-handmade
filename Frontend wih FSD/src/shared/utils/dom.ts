export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }
}

export function handleImageError(event: Event, fallbackSrc: string = '@/assets/placeholder-image.png'): void {
  const target = event.target as HTMLImageElement;
  if (target.src !== require(fallbackSrc)) {
    target.src = require(fallbackSrc);
  }
}

export function openEmailClient(email: string, subject: string = '', body: string = ''): void {
  const mailtoUrl = `mailto:${email}${subject || body ? '?' : ''}${
    subject ? `subject=${encodeURIComponent(subject)}` : ''
  }${subject && body ? '&' : ''}${
    body ? `body=${encodeURIComponent(body)}` : ''
  }`;
  
  window.location.href = mailtoUrl;
}