import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';

@Component({
  standalone: true,
  selector: 'descrpition',
  imports: [FormsModule, CommonModule, EditorModule, CardModule],
  templateUrl: './descrpition.component.html',
  styleUrl: './descrpition.component.scss',
})
export class DescrpitionComponent implements OnInit {
  description = '';
  @Input() showTitle = true;
  @Input() html!: string | null;
  @Output() descriptionData = new EventEmitter<string>();
  @Input() canEdit = false;
  safeHtml!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.updateHtmlContent();
  }

  onChange(event: any) {
    this.descriptionData.emit(event.htmlValue);
    this.html = event;
  }

  private updateHtmlContent(): void {
    if (this.html && !this.canEdit) {
      try {
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.html);
      } catch (e) {
        console.error('Failed to parse HTML:', e);
      }
    }
  }
}
