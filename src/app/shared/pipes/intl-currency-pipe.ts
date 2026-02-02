import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'intlCurrency',
})
export class IntlCurrencyPipe implements PipeTransform {
  transform(price: number, currency: string, lang: string): string {
    return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(price);
  }
}
