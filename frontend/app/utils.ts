/**
 * Format dates consistently
 */
export function formatDate(date: string | Date) {
  // return new Date(date).toLocaleDateString();

  date = new Date(date);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const paddedDay = String(day).padStart(2, "0");
  const paddedMonth = String(month).padStart(2, "0");

  return `${year}–${paddedMonth}–${paddedDay}`;
}

export const slugToRhinoSystem = (slug: string) => {
  switch (slug) {
    case "water-heating-systems":
      return "water_heating systems".toUpperCase();
    case "outfitting-interior":
      return slug.replaceAll("-", "_").toUpperCase();
    default:
      return slug.replaceAll("-", " ").toUpperCase();
  }
};
