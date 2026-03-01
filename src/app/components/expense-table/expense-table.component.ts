import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ExpenseTableDataConfig } from '../../interfaces/ui-config/expense-table-config.interface';
import { UiService } from '../../services/ui.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-table',
  imports: [DatePipe],
  templateUrl: './expense-table.component.html',
  styleUrl: './expense-table.component.css'
})
export class ExpenseTableComponent {


  @Input() expenseConfig: ExpenseTableDataConfig[] = [];
  @Output() removeRow: EventEmitter<ExpenseTableDataConfig> = new EventEmitter();

  uiService = inject(UiService);

  handleAction(tablerData: ExpenseTableDataConfig) {
    this.removeRow.emit(tablerData);
  }

}
