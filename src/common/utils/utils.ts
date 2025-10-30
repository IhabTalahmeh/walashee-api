export function removeLeadingZero(num: string) {
  let numStr = num.toString();
  if (numStr.charAt(0) === '0') {
    return numStr.substring(1);
  }
  return numStr;
}