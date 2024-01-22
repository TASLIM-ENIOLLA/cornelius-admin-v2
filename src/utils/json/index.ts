export function isJSON(JSONString: string) {
  try {
    return JSON.parse(JSONString);
  }
  catch(error) {
    return false;
  }
}