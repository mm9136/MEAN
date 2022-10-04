import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchLetters'
})
export class SearchLettersPipe implements PipeTransform {

  transform(searchString: string): string {
   if(searchString){
      searchString = searchString.trim();
      var firstChar = searchString.charAt(0).toUpperCase();
      searchString = firstChar + searchString.substring(1);

     }
     return searchString;

  }

}
