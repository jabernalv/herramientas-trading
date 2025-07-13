// Función para forzar la renderización de MathJax
export function renderMathJax(): void {
  if (typeof window !== "undefined" && (window as any).MathJax) {
    const MathJax = (window as any).MathJax;

    // Esperar un poco para que MathJax esté listo
    setTimeout(() => {
      if (MathJax.typesetPromise) {
        MathJax.typesetPromise([document.body]).catch(console.error);
      } else if (MathJax.typeset) {
        MathJax.typeset([document.body]);
      }
    }, 100);
  }
}

// Función para renderizar un elemento específico
export function renderMathJaxElement(element: HTMLElement): void {
  if (typeof window !== "undefined" && (window as any).MathJax) {
    const MathJax = (window as any).MathJax;

    setTimeout(() => {
      if (MathJax.typesetPromise) {
        MathJax.typesetPromise([element]).catch(console.error);
      } else if (MathJax.typeset) {
        MathJax.typeset([element]);
      }
    }, 100);
  }
}
