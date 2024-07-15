import {
  DomPortalOutlet,
  PortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comprovante',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './comprovante.component.html',
  styleUrl: './comprovante.component.scss',
})
export class ComprovanteComponent implements AfterViewInit {
  @ViewChild('iframe') printFrame: ElementRef;
  @ViewChild('comprovanteContent') content;

  private portalHost: PortalOutlet;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    // setTimeout(() => this.imprimir(), 1000);
  }

  imprimir() {
    this.imprimirConteudoPrincipal();
  }

  imprimirConteudoPrincipal(): void {
    const iframe = this.printFrame.nativeElement;

    this.portalHost = new DomPortalOutlet(
      iframe.contentDocument.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    this._attachStyles(iframe.contentWindow);

    const portal = new TemplatePortal(this.content, this.viewContainerRef, {
      content: this.content,
    });

    this.portalHost.attach(portal);
    iframe.contentWindow.onafterprint = () => {
      iframe.contentDocument.body.innerHTML = '';
    };

    this.waitForImageToLoad(iframe, () => iframe.contentWindow.print());
  }

  private waitForImageToLoad(iframe: HTMLIFrameElement, done: Function): void {
    const interval = setInterval(() => {
      const allImages =
        iframe.contentDocument.body.querySelectorAll('img-comp');
      const loaded = Array.from({ length: allImages.length }).fill(false);
      allImages.forEach((img: HTMLImageElement, idx) => {
        loaded[idx] = img.complete && img.naturalHeight !== 0;
      });
      if (loaded.every((c) => c === true)) {
        clearInterval(interval);
        done();
      }
    }, 500);
  }

  private _attachStyles(targetWindow: Window): void {
    // Copy styles from parent window
    document.querySelectorAll('style').forEach((htmlElement) => {
      targetWindow.document.head.appendChild(htmlElement.cloneNode(true));
    });
    // Copy stylesheet link from parent window
    const styleSheetElement = this._getStyleSheetElement();
    targetWindow.document.head.appendChild(styleSheetElement);
  }

  private _getStyleSheetElement() {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach((htmlElement) => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.type = 'text/css';
        styleSheetElement.href = absoluteUrl;
      }
    });
    console.log(styleSheetElement.sheet);
    return styleSheetElement;
  }

  imprimirComPrint() {
    window.print();
  }

  imprimirComIframe() {
    const doc = this.printFrame.nativeElement.contentWindow.document;

    // const doc = iframe.contentWindow.document;
    console.log(this.content?.nativeElement?.outerHTML);

    doc.open();
    doc.write(this.content?.nativeElement?.outerHTML);
    doc.close();
    this.printFrame.nativeElement.contentWindow.focus();
    this.printFrame.nativeElement.contentWindow?.print();
    //iframe.contentWindow.print();
  }
}
