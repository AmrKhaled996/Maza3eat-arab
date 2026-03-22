/**
 * Extract date and time from an ISO 8601 datetime string.
 *
 * @param {string} input - an ISO 8601 datetime string.
 * @returns {object} - an object with two properties, date and time, both in the format of "YYYY-MM-DD" and "HH:mm" respectively.
 * @example
 * const input = "2022-01-01T12:30:00.000Z";
 * const result = extractDateTime(input);
 * console.log(result.date); // "2022-01-01"
 * console.log(result.time); // "12:30"
 */
export const extractDateTime = (dateinput: string): object => {
  // Remove the 'Z' at the end of the input string to avoid timezone issues
  const realDate: string = dateinput.replace("Z", "") as string;

  const date: Date = new Date(realDate);

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts: Intl.DateTimeFormatPart[] = formatter.formatToParts(date);
  // short cut for getting the value of a specific part type
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value as string;

  const extractedDate = `${get("year")}-${get("month")}-${get("day")}`;
  const extractedTime = `${get("hour")}:${get("minute")}`;

  return {
    date: extractedDate as string,
    time: extractedTime as string,
  };
};

/**
 * Extract day, month and year from a date input.
 *
 * @param {string|Date} dateInput - a date string or a Date object.
 * @returns {object} - an object with three properties, day, month and year.
 * @example
 * const input = "2022-01-01";
 * const result = extractDateParts(input);
 * console.log(result.day); // 1
 * console.log(result.month); // "Jan"
 * console.log(result.year); // 2022
 */
export const extractDateParts = (dateInput: string): object => {
  const dateObj: Date = new Date(dateInput);

  const day: number = dateObj.getDate(); // Day number
  const year: number = dateObj.getFullYear(); // Year number

  const monthNames: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month:string = monthNames[dateObj.getMonth()]; // Month short name

  return { day, month, year };
};
