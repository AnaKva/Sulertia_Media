export function splitAtWordCount(text: string, count: number) {
  const words = text.split(' ');
  const before = words.slice(0, count).join(' ');
  const after = words.slice(count).join(' ');
  return { before, after };
}