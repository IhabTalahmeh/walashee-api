import { PhoneDto } from "src/modules/auth/dto/phone.dto";
import { ListDto } from "../dto";
const sharp = require('sharp');

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

export const compressImage = async (fileBuffer: Buffer, size = 2048, quality = 80) => {
  try {
    const compressedBuffer = await sharp(fileBuffer)
      .resize({
        width: size,
        height: size,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .jpeg({ quality: quality })
      .toBuffer();
    return compressedBuffer;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}
