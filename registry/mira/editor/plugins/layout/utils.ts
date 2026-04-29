/* oxlint-disable */
// @ts-nocheck
export function getItemsCountFromTemplate(template: string): number {
  return template.trim().split(/\s+/).length;
}
