export function categorize(text: string): string[] {
  const t = text.toLowerCase()
  const cats: string[] = []
  const push = (c: string) => { if (!cats.includes(c)) cats.push(c) }
  if (/\b(code|software|program|bug|debug|engineer|developer)\b/.test(t)) push('Technology')
  if (/\b(art|beauty|poetry|paint|music)\b/.test(t)) push('Art')
  if (/\b(love|heart|romance|kiss)\b/.test(t)) push('Love')
  if (/\b(life|living|death|born|die)\b/.test(t)) push('Life')
  if (/\b(truth|wisdom|philosophy|virtue|reason)\b/.test(t)) push('Philosophy')
  if (/\b(work|success|failure|job|career)\b/.test(t)) push('Work')
  if (/\b(time|minute|hour|second|clock)\b/.test(t)) push('Time')
  if (/\b(science|physics|chemistry|math|biology)\b/.test(t)) push('Science')
  if (/\b(humor|joke|laugh|funny)\b/.test(t)) push('Humor')
  if (cats.length === 0) push('General')
  return cats.slice(0, 3)
}
