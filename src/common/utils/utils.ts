import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { ListDto } from "../dto";

export function removeLeadingZero(num: string) {
  let numStr = num.toString();
  if (numStr.charAt(0) === '0') {
    return numStr.substring(1);
  }
  return numStr;
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getFullPhoneNumber(dto: PhoneDto) {
  dto.number = removeLeadingZero(dto.number);
  return `${dto.phoneCode}${dto.number}`;
}

export function getListDto(dto: ListDto) {
  const page = (dto.page - 1) * dto.size;
  const size = dto.size;

  return { page, size };
}