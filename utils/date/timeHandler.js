export function date_output_format(time_string) {
  return new Date(time_string).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function full_time_format(time_string) {
  const date = new Date(time_string);
  const timeString = date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  
  return `${dateString} ${timeString}`;
}

export function getFormattedUTCTime() {
  const now = new Date();
  const isoString = now.toISOString();
  return isoString.replace('Z', '+00:00');
}