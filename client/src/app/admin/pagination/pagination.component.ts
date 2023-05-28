
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Output() pageChanged = new EventEmitter<number>();

  totalPages: number;
  pages: number[];

  ngOnChanges() {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.pageChanged.emit(pageIndex);
    }
  }
}

