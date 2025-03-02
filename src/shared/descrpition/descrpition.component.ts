import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
    selector: 'descrpition',
    imports: [FormsModule, CommonModule],
    templateUrl: './descrpition.component.html',
    styleUrl: './descrpition.component.scss'
})
export class DescrpitionComponent implements OnInit, OnChanges, OnDestroy {
  description: string = '';
  @Input() html!: string | null;
  @Output() descriptionData = new EventEmitter<string>();
  @Input() canEdit: boolean = false;
  safeHtml!: SafeHtml; // Property to store the sanitized HTML

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.updateHtmlContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['html'] && !this.canEdit) {
      this.updateHtmlContent();
    }
  }

  ngOnDestroy(): void {
  }

  onChange(event: any) {
    this.descriptionData.emit(event);
    this.html = event;
  }

  private updateHtmlContent(): void {
    // if (this.html && !this.canEdit) {
    //   try {
    //     const parsedHtml = toHTML(JSON.parse(this.html));
    //     this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(parsedHtml);
    //   } catch (e) {
    //     console.error('Failed to parse HTML:', e);
    //   }
    // }
  }
}
