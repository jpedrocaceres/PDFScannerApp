declare module 'react-native-pdf-lib' {
  interface PDFPage {
    create(): PDFPage;
    setMediaBox(width: number, height: number): PDFPage;
    drawImage(path: string, options: {
      x: number;
      y: number;
      width: number;
      height: number;
    }): PDFPage;
  }

  interface PDFDocument {
    create(path: string): PDFDocument;
    addPages(pages: PDFPage[]): PDFDocument;
    write(): Promise<string>;
    modify(path: string): PDFDocument;
  }

  const PDFLib: {
    PDFPage: PDFPage;
    PDFDocument: PDFDocument;
    getDocumentsDirectory(): Promise<string>;
  };

  export default PDFLib;
} 