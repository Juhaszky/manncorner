import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EditorModule } from 'primeng/editor';


@Component({
  standalone: true,
    selector: 'descrpition',
    imports: [FormsModule, CommonModule, EditorModule],
    templateUrl: './descrpition.component.html',
    styleUrl: './descrpition.component.scss'
})
export class DescrpitionComponent implements OnInit {
  description = '';
  @Input() html!: string | null;
  @Output() descriptionData = new EventEmitter<string>();
  @Input() canEdit = false;
  safeHtml!: SafeHtml; // Property to store the sanitized HTML

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    //this.updateHtmlContent();
  }

  onChange(event: any) {
    this.descriptionData.emit(event.htmlValue);
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
