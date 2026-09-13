import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function sanitizeClone(cloned) {
  const apply = (node) => {
    node.style.fontFamily = 'Arial, Helvetica, sans-serif';
    node.style.letterSpacing = '0px';
    node.style.wordSpacing = 'normal';
    node.style.wordBreak = 'normal';
    node.style.overflowWrap = 'normal';
    node.style.fontKerning = 'none';
    node.style.fontFeatureSettings = 'normal';
    node.style.textRendering = 'geometricPrecision';
    node.style.transform = 'none';
    node.style.zoom = '1';
  };

  apply(cloned);
  cloned.querySelectorAll('*').forEach(apply);

  let parent = cloned.parentElement;
  while (parent) {
    parent.style.transform = 'none';
    parent.style.zoom = '1';
    parent = parent.parentElement;
  }
}

export async function downloadElementAsPdf(element, filename) {
  if (!element) throw new Error('PDF element is missing');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (_doc, cloned) => sanitizeClone(cloned),
  });

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  const imgData = canvas.toDataURL('image/png');

  let position = 0;
  let remaining = imgHeight;

  pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
  remaining -= pageHeight;

  while (remaining > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    remaining -= pageHeight;
  }

  pdf.save(filename);
}
