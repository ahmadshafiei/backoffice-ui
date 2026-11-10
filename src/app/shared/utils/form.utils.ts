import { ValidationErrors } from '@angular/forms';

/** Farsi messages for the built-in validators; `custom` lets a field override or extend them. */
export function fieldErrorMessage(errors: ValidationErrors | null, custom: Record<string, string> = {}): string {
  if (!errors) return '';
  const key = Object.keys(errors)[0];
  if (custom[key]) return custom[key];
  switch (key) {
    case 'required': return 'این فیلد الزامی است.';
    case 'maxlength': return `حداکثر ${errors['maxlength'].requiredLength} نویسه مجاز است.`;
    case 'minlength': return `حداقل ${errors['minlength'].requiredLength} نویسه لازم است.`;
    case 'pattern': return 'مقدار واردشده معتبر نیست.';
    default: return 'مقدار واردشده معتبر نیست.';
  }
}
