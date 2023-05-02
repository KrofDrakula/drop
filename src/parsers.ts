/**
 * Attempts to parse the file as JSON content and returns the
 * parsed value.
 */
export const asJSON = async (
  file: File,
  reviver?: Parameters<typeof JSON.parse>[1]
) => {
  const content = await file.text();
  return JSON.parse(content, reviver);
};

/**
 * Returns the contents of a file as a string.
 */
export const asText = async (file: File) => file.text();
