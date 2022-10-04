import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number): string {
    return (Math.round(value * 100) / 100).toFixed(2) + '\u20AC';
  }

}
