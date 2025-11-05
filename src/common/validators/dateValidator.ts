import {
	registerDecorator,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
	validate(date: string) {
		if (!date) {
			return false;
		}
		const [year, month, day] = date
			.split('-')
			.map((str) => parseInt(str, 10));
		const dateObj = new Date(year, month - 1, day);
		return (
			dateObj.getFullYear() === year &&
			dateObj.getMonth() === month - 1 &&
			dateObj.getDate() === day
		);
	}

	defaultMessage() {
		return 'The date is not valid.';
	}
}

export function IsValidDate(validationOptions?: any) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'IsValidDate',
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: IsValidDateConstraint,
		});
	};
}
