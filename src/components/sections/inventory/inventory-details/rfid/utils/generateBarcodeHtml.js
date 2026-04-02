const code39Table = {
  0: "101001101101", 1: "110100101011", 2: "101100101011", 3: "110110010101",
  4: "101001101011", 5: "110100110101", 6: "101100110101", 7: "101001011011",
  8: "110100101101", 9: "101100101101", A: "110101001011", B: "101101001011",
  C: "110110100101", D: "101011001011", E: "110101100101", F: "101101100101",
  G: "101010011011", H: "110101001101", I: "101101001101", J: "101011001101",
  K: "110101010011", L: "101101010011", M: "110110101001", N: "101011010011",
  O: "110101101001", P: "101101101001", Q: "101010110011", R: "110101011001",
  S: "101101011001", T: "101011011001", U: "110010101011", V: "100110101011",
  W: "110011010101", X: "100101101011", Y: "110010110101", Z: "100110110101",
  "-": "100101011011", ".": "110010101101", " ": "100110101101",
  $: "100100100101", "/": "100100101001", "+": "100101001001",
  "%": "101001001001", "*": "100101101101",
};

const NARROW = 2;
const WIDE = 4;
const BAR_HEIGHT = 80;

export function generateBarcodeHtml(value) {
  const text = (value || "").toString().toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, "");
  if (!text) return "";
  let pattern = code39Table["*"] || "";
  for (const ch of text) { if (code39Table[ch]) pattern += code39Table[ch]; }
  pattern += code39Table["*"] || "";

  const bars = pattern.split("").map((bit, i) => {
    const isBar = i % 2 === 0;
    const w = bit === "1" ? WIDE : NARROW;
    const bg = isBar ? "#000" : "transparent";
    return `<div style="display:inline-block;width:${w}px;min-width:${w}px;height:${BAR_HEIGHT}px;background:${bg};"></div>`;
  }).join("");

  return `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="display:flex;flex-direction:row;align-items:flex-end;height:${BAR_HEIGHT}px;line-height:0;">${bars}</div>
    <div style="margin-top:12px;font-size:18px;font-weight:500;letter-spacing:0.05em;color:#111;">${text}</div>
  </div>`;
}

export function openPrintWindow(barcodeHtmlPages, title = "Print RFID Tags") {
  const pagesArray = Array.isArray(barcodeHtmlPages) ? barcodeHtmlPages : [barcodeHtmlPages];
  const pages = pagesArray.map((html) => `<div class="page">${html}</div>`).join("");

  const printWindow = window.open("", "_blank", "width=600,height=500");
  if (printWindow) {
    printWindow.document.write(`
      <html>
      <head><title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; page-break-after: always; }
        .page:last-child { page-break-after: auto; }
        @media print { @page { size: auto; margin: 0; } }
      </style>
      </head>
      <body>${pages}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
