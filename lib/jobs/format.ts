// 让职位列表和详情使用一致的英文发布时间格式。
// Use a consistent English publication date format in job lists and detail views.
export function formatJobDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
