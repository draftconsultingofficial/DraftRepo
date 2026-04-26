export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseMarkdown(text: string) {
  if (!text) return "";

  let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h4 class="text-xl font-semibold mt-8 mb-4 text-gray-900">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900">$1</h2>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

  // Lists
  html = html.replace(/^[\-|\*|•]\s+(.*$)/gim, '<li class="ml-6 list-disc mb-2 pl-1">$1</li>');
  html = html.replace(/(<li.*<\/li>)\n?/gim, '<ul class="mb-2 mt-2">$1</ul>');
  html = html.replace(/<\/ul>\n<ul class="mb-2 mt-2">/gim, '');

  // Bold headings (pseudo-headings they might have used like "Responsibilities:")
  html = html.replace(/^([A-Z][a-zA-Z\s]+):$/gim, '<h4 class="text-lg font-bold mt-8 mb-3 text-gray-900">$1:</h4>');

  // Paragraphs & Line Breaks
  html = html.split(/(?:\r?\n){2,}/).map(p => {
    if (/^<(h|u|l)/.test(p)) return p; 
    return `<p class="mb-5 leading-relaxed">${p.replace(/\n/g, '<br />')}</p>`;
  }).join('');

  return html;
}

export function stripMarkdown(text: string) {
  if (!text) return "";
  // remove markdown headers, bold/italic, lists, and links
  let out = text.replace(/[#*>\-`\[\]\(\)\_\*]/g, "");
  // collapse multiple newlines and trim
  out = out.replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
  return out;
}
