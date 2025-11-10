export function isNew(createdAt: string, hoursThreshold = 48): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= hoursThreshold;
}
