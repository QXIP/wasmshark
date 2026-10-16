const HIGHLIGHT_COLORS = ['yellow', '#ffcaca', '#b7f875', '#86f2fb', '#DD99FF', '#eea371'];

export interface HighlightPart {
  text: string;
  match: boolean;
  color?: string;
  radius?: string;
  textColor?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split text into plain and matched parts. Callers render `text` as text,
 * never as HTML, so filter and packet values cannot inject markup.
 */
export function highlightHtml(text: unknown, filter: string, isRedial = false): HighlightPart[] {
  const raw = text == null ? '' : String(text);
  const parts = filter.split('||').map((part, index) => ({ part, index })).filter((item) => item.part !== '');
  if (parts.length === 0) {
    return [{ text: raw, match: false }];
  }

  const re = new RegExp(parts.map((item) => escapeRegExp(item.part)).join('|'), 'g');
  const out: HighlightPart[] = [];
  let last = 0;
  for (const match of raw.matchAll(re)) {
    const index = match.index ?? 0;
    if (index > last) {
      out.push({ text: raw.slice(last, index), match: false });
    }
    const found = match[0];
    const colorIndex = parts.find((item) => item.part === found)?.index ?? 0;
    out.push({
      text: found,
      match: true,
      color: HIGHLIGHT_COLORS[colorIndex % HIGHLIGHT_COLORS.length],
      radius: isRedial ? '4px' : '2px',
      textColor: isRedial ? undefined : 'black',
    });
    last = index + found.length;
  }
  if (last < raw.length || out.length === 0) {
    out.push({ text: raw.slice(last), match: false });
  }
  return out;
}
