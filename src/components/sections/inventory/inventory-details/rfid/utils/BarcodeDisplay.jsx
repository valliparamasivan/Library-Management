"use client";

/**
 * Code 39 Barcode Display Component
 * Generates a scannable Code 39 barcode matching ZPL format
 * ZPL: ^BY2,2,70 (module width 2, wide bar ratio 2, height 70)
 * ZPL: ^B3N,60,Y,N,N (Code 39, height 60, with interpretation line)
 */
const BarcodeDisplay = ({ value = "" }) => {
  // Code 39 character encoding table
  // Each character is represented by 9 elements (5 bars + 4 spaces)
  // Format: 1=wide, 0=narrow (alternating bars and spaces)
  const code39Table = {
    0: "101001101101",
    1: "110100101011",
    2: "101100101011",
    3: "110110010101",
    4: "101001101011",
    5: "110100110101",
    6: "101100110101",
    7: "101001011011",
    8: "110100101101",
    9: "101100101101",
    A: "110101001011",
    B: "101101001011",
    C: "110110100101",
    D: "101011001011",
    E: "110101100101",
    F: "101101100101",
    G: "101010011011",
    H: "110101001101",
    I: "101101001101",
    J: "101011001101",
    K: "110101010011",
    L: "101101010011",
    M: "110110101001",
    N: "101011010011",
    O: "110101101001",
    P: "101101101001",
    Q: "101010110011",
    R: "110101011001",
    S: "101101011001",
    T: "101011011001",
    U: "110010101011",
    V: "100110101011",
    W: "110011010101",
    X: "100101101011",
    Y: "110010110101",
    Z: "100110110101",
    "-": "100101011011",
    ".": "110010101101",
    " ": "100110101101",
    $: "100100100101",
    "/": "100100101001",
    "+": "100101001001",
    "%": "101001001001",
    "*": "100101101101", // Start/Stop character
  };

  // Generate barcode pattern for Code 39 matching ZPL format
  const generateBarcodePattern = (text) => {
    if (!text || text.trim() === "") return [];

    // Convert to uppercase and filter valid Code 39 characters
    const cleanText = text
      .toString()
      .toUpperCase()
      .replace(/[^0-9A-Z\-. $/+%]/g, "");
    if (cleanText === "") return [];

    // Start pattern (asterisk)
    let pattern = code39Table["*"] || "";

    // Add each character
    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      if (code39Table[char]) {
        pattern += code39Table[char];
      }
    }

    // End pattern (asterisk)
    pattern += code39Table["*"] || "";

    // Convert to array of elements (bars and spaces)
    // Even indices (0, 2, 4...) are bars, odd indices (1, 3, 5...) are spaces
    return pattern.split("").map((bit, index) => ({
      isBar: index % 2 === 0,
      isWide: bit === "1",
    }));
  };

  const barcodePattern = generateBarcodePattern(value);
  // Match ZPL: module width 2, wide bar ratio 2
  // So narrow = 2px, wide = 4px (scaled down for display)
  const narrowWidth = 1; // pixels
  const wideWidth = 2; // pixels
  const barHeight = 60; // Match ZPL height 60

  if (barcodePattern.length === 0) {
    return (
      <div className="flex items-center justify-center h-15 w-20 rounded bg-white p-1">
        <div className="text-xs text-gray-400">No code</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className="flex items-end gap-0"
        style={{ height: `${barHeight}px` }}
      >
        {barcodePattern.map((element, index) => {
          const width = element.isWide ? wideWidth : narrowWidth;
          const bgColor = element.isBar ? "bg-black" : "bg-white";

          return (
            <div
              key={`element-${index}`}
              className={bgColor}
              style={{
                width: `${width}px`,
                height: element.isBar ? `${barHeight}px` : "100%",
                minWidth: `${width}px`,
              }}
            />
          );
        })}
      </div>
      {value && (
        <div className="text-sm font-normal text-gray-800 mt-2 tracking-wide">
          {value.toString().toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default BarcodeDisplay;
