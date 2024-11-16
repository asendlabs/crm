export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  entityName: string,
  retries = 3,
  delay = 1000,
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const data = await fetcher();
      if (data) {
        return data;
      }
    } catch (error) {
      // console.error(
      //   `Error fetching ${entityName} on attempt ${attempt}:`,
      //   error,
      // );
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  // console.warn(`${entityName} fetch unsuccessful after ${retries} retries`);
  return null;
}
