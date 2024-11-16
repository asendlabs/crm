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

export function encryptToBase64URI(text: string): string {
  return encodeURI(btoa(text));
}

export function decryptFromBase64URI(text: string): string {
  return atob(decodeURI(text));
}

export function formatDate(date: string | Date): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  // Convert to different units
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);

  // Just now
  if (diffInSeconds < 30) {
    return "just now";
  }

  // Minutes
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  // Hours
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // Days
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  // Weeks
  if (weeks < 4) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  // Months
  return `${months} month${months === 1 ? "" : "s"} ago`;
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

export function formatMinimal({
  dateString,
  showTime = true,
}: {
  dateString: string | null | undefined | Date;
  showTime?: boolean;
}): string {
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

  if (showTime) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${day} ${month} ${year} at ${hour12}:${paddedMinutes} ${period}`;
  }

  return `${day} ${month} ${year}`;
}
