import { Injectable } from '@angular/core';
import { Color, Colors } from '../shared/types/colors';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  generateRandomColor1(counter: number) {
    const colors = ['amber', 'red', 'blue'];
    return colors[counter % colors.length];
  }

  generateTailwindClass1(color: string, type: string): string {
    // Convert the color name to lowercase to ensure case insensitivity
    const colorName = color.toLowerCase();

    // Generate the class based on the type
    let tailwindClass;
    switch (type) {
      case 'bg':
        tailwindClass = color == 'amber' ? `amber-bg` : color === 'red' ? 'red-bg' : 'blue-bg';
        break;
      case 'text':
        tailwindClass = color == 'amber' ? `amber-text` : color === 'red' ? 'red-text' : 'blue-text';
        break;
      case 'border':
        tailwindClass = color == 'amber' ? `amber-border` : color === 'red' ? 'red-border' : 'blue-border';
        break;
      default:
        tailwindClass = '';
        console.warn('Invalid type provided. Use "bg", "text", or "border".');
    }

    return tailwindClass;
  }

  private readonly colors = Colors;

  generateRandomColor(index: number): Color {
    return this.colors[index % this.colors.length];
  }

  generateTailwindClass(
    color: Color,
    type: 'bg' | 'text' | 'border',
    shade: number = 700
  ): string {
    return `${type}-${color}-${shade}`;
  }


}
