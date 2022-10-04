import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'grafpercentage'
})
export class GrafpercentagePipe implements PipeTransform {

  transform(value : number): string {
    return (value * 100).toFixed(2) + '%';
  }

}
