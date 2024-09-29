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

  const seconds = 60;
  const minutes = 60 * seconds;
  const hours = 60 * minutes;
  const days = 24 * hours;
  const months = 30 * days;
  const years = 12 * months;

  if (diffInSeconds < seconds) {
    return "just now";
  } else if (diffInSeconds < minutes) {
    const count = Math.floor(diffInSeconds / seconds);
    return `${count} min${count > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < hours) {
    const count = Math.floor(diffInSeconds / minutes);
    return `${count} hour${count > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < days) {
    const count = Math.floor(diffInSeconds / hours);
    return `${count} hour${count > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < months) {
    const count = Math.floor(diffInSeconds / days);
    return `${count} day${count > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < years) {
    const count = Math.floor(diffInSeconds / months);
    return `${count} month${count > 1 ? "s" : ""} ago`;
  } else {
    const count = Math.floor(diffInSeconds / years);
    return `${count} year${count > 1 ? "s" : ""} ago`;
  }
}

export function formatDate(dateString: string | null | undefined | Date): string {
  if (!dateString) {
    return "";
  }
  const date = new Date(dateString);

  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Add the ordinal suffix (e.g., "1st", "2nd", "3rd", "4th")
  const daySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${daySuffix(day)} ${month} ${year}`;
}