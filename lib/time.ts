export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(
      `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`,
    );
  }

  if (parts.length > 1) {
    const lastPart = parts.pop();
    return `${parts.join(", ")} and ${lastPart}`;
  }

  return parts[0] ?? "";
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
