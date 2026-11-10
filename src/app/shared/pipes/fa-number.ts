import { Pipe, PipeTransform } from '@angular/core';
import { toFaDigits } from '../utils/digits.utils';

/** {{ 1250 | faNumber }} -> ۱٬۲۵۰ ; pass `false` to skip thousands separators. */
@Pipe({ name: 'faNumber' })
export class FaNumberPipe implements PipeTransform {
  transform(value: number | string | null | undefined, grouping = true): string {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'number' && grouping) {
      return new Intl.NumberFormat('fa-IR').format(value);
    }
    return toFaDigits(value);
  }
}
