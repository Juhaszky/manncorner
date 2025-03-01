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
import { Editor, NgxEditorModule, toHTML, Toolbar } from 'ngx-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'descrpition',
    imports: [NgxEditorModule, FormsModule, CommonModule],
    templateUrl: './descrpition.component.html',
    styleUrl: './descrpition.component.scss'
})
export class DescrpitionComponent implements OnInit, OnChanges, OnDestroy {
  description: string = '';
  editor!: Editor;
  @Input() html!: string | null;
  @Output() descriptionData = new EventEmitter<string>();
  @Input() canEdit: boolean = false;
  safeHtml!: SafeHtml; // Property to store the sanitized HTML
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.updateHtmlContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['html'] && !this.canEdit) {
      this.updateHtmlContent();
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onChange(event: any) {
    this.descriptionData.emit(event);
    this.html = event;
  }

  private updateHtmlContent(): void {
    if (this.html && !this.canEdit) {
      try {
        const parsedHtml = toHTML(JSON.parse(this.html));
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(parsedHtml);
      } catch (e) {
        console.error('Failed to parse HTML:', e);
      }
    }
  }
}
