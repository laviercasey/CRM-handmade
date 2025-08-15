export function formatAnswer(answer: string): string {
  if (!answer) return '';
  
  if (answer.includes('<')) {
    return answer;
  }
  
  return answer.replace(/\n/g, '<br>');
}


export function searchInText(text: string, query: string): boolean {
  if (!text || !query) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}


export function stripHtml(text: string): string {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
}