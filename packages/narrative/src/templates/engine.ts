/** Lightweight Mustache-style template renderer (no eval). */
export function renderTemplate(template: string, context: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = context[key];
    return value === undefined ? '' : String(value);
  });
}
