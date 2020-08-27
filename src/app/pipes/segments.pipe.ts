import { Pipe, PipeTransform } from '@angular/core';
import { extractMath } from 'extract-math';

@Pipe({
  name: 'segments'
})
export class SegmentsPipe implements PipeTransform {

  transform(content: string, ...args: unknown[]): any {
    return extractMath(content);
  }

}
