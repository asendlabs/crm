export function generateEmailVerifyCode() {
  const length: number = 5;
  const characters = "0123456789";
  let code: string = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export function timeAgo(timestamp: string): string {
  const now: Date = new Date();
  const past: Date = new Date(timestamp);
  const diffInSeconds: number = Math.floor(
    (now.getTime() - past.getTime()) / 1000,
  );

  const getTimeOfDay = (date: Date): string => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 22) return "evening";
    return "night";
  };

  const getDayContext = (date: Date, isRelative: boolean = false): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = days[date.getDay()];

    if (isRelative) {
      const today = new Date();
      const dayDiff = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dayDiff) {
        case 0:
          return "today";
        case 1:
          return "yesterday";
        case 2:
          return "the day before yesterday";
        case -1:
          return "tomorrow";
        case -2:
          return "the day after tomorrow";
      }

      if (dayDiff > 2 && dayDiff < 7) {
        return `last ${dayName}`;
      }
    }
    return dayName;
  };

  if (diffInSeconds < 5) {
    return "just now";
  }
  if (diffInSeconds < 30) {
    return "a few seconds ago";
  }
  if (diffInSeconds < 60) {
    return "less than a minute ago";
  }

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (minutes === 1) return "a minute ago";
  if (minutes < 5) return "a few minutes ago";
  if (minutes < 15) return "about 10 minutes ago";
  if (minutes < 25) return "about 20 minutes ago";
  if (minutes < 35) return "half an hour ago";
  if (minutes < 45) return "about half an hour ago";
  if (minutes < 55) return "about 45 minutes ago";

  if (hours === 1) return "an hour ago";
  if (hours < 24) {
    const todayOrYesterday = hours >= now.getHours() ? "yesterday" : "today";
    const timeOfDay = getTimeOfDay(past);
    return `${todayOrYesterday} in the ${timeOfDay}`;
  }

  if (days === 1) return "yesterday";
  if (days === 2) return "the day before yesterday";
  if (days <= 7) {
    return `last ${getDayContext(past)}`;
  }

  if (weeks === 1) return "last week";
  if (weeks === 2) return "two weeks ago";
  if (weeks <= 4) return `${weeks} weeks ago`;

  if (months === 1) return "last month";
  if (months === 2) return "two months ago";
  if (months === 6) return "half a year ago";
  if (months < 12) return `${months} months ago`;

  if (years === 1) return "last year";
  if (years === 2) return "two years ago";
  return `${years} years ago`;
}

export function formatDate(
  dateString: string | null | undefined | Date,
): string {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getDayName = (date: Date): string => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date();
    const dayDiff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (isSameDay(date, today)) return "today";
    if (dayDiff === 1) return "yesterday";
    if (dayDiff === -1) return "tomorrow";
    if (dayDiff > 1 && dayDiff < 7) return `last ${days[date.getDay()]}`;
    if (dayDiff < -1 && dayDiff > -7) return `next ${days[date.getDay()]}`;
    return "";
  };

  const formatMonth = (date: Date): string => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const currentYear = new Date().getFullYear();
    const dateYear = date.getFullYear();
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    const getOrdinal = (n: number): string => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const relativeDayName = getDayName(date);
    if (relativeDayName) return relativeDayName;

    if (dateYear === currentYear) {
      return `${monthName} ${getOrdinal(day)}`;
    }

    return `${monthName} ${getOrdinal(day)}, ${dateYear}`;
  };

  return formatMonth(date);
}

export function formatDateAndTime(
  dateStringDerived: string | null | undefined | Date,
): string {
  if (!dateStringDerived) {
    return "";
  }
  const date = new Date(dateStringDerived);

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;

    if (minutes === 0) {
      if (hours === 0) return "midnight";
      if (hours === 12) return "noon";
      return `${hour12} ${period}`;
    }

    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hour12}:${paddedMinutes} ${period}`;
  };

  const timeString = formatTime(date);
  const dateString = formatDate(date);

  if (dateString === "today") {
    return `today at ${timeString}`;
  }
  if (dateString === "yesterday") {
    return `yesterday at ${timeString}`;
  }
  if (dateString === "tomorrow") {
    return `tomorrow at ${timeString}`;
  }
  if (dateString.startsWith("last") || dateString.startsWith("next")) {
    return `${dateString} at ${timeString}`;
  }

  return `${dateString} at ${timeString}`;
}

export function formatMinimal(
  dateString: string | null | undefined | Date,
): string {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");

  return `${day} ${month} ${year} at ${hour12}:${paddedMinutes} ${period}`;
}
