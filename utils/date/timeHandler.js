export function date_output_format(time_string) {
  return new Date(time_string).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function spec_time_output_format(time_string) {
  return new Date(time_string).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })
}