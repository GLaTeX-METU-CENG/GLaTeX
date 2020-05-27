function setupPage() {
  var body = DocumentApp.getActiveDocument().getBody();
  var text = body.getText();
  text = text.replace(/\n\s*\n/g, '\n');
  body.setText(text);
  body.editAsText().setFontSize(10);
  body.editAsText().setFontFamily('Georgia');
  body.setMarginTop(10);
  body.setMarginBottom(10);
  body.setMarginLeft(10);
  body.setMarginRight(10);
}

function auth() {
  return ScriptApp.getOAuthToken();
}

function colorSyntax() {
  var body = DocumentApp.getActiveDocument().getBody();
  var text = body.getText(); DocumentApp.getActiveDocument().get
  var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262';
  var colorEqn = {}; colorEqn[DocumentApp.Attribute.FOREGROUND_COLOR] = '#008000';
  var colorCmt = {}; colorCmt[DocumentApp.Attribute.FOREGROUND_COLOR] = '#DC143C';
  var colorCurly = {}; colorCurly[DocumentApp.Attribute.FOREGROUND_COLOR] = '#C4820F';
  var startCmd = -1;
  var startEqn = -1;
  var startCmt = -1;
  var i;
  for (i=0; i<text.length; ++i) {
    if (text[i] == '\\') {
      if (startCmd == -1) {
        startCmd = i;
      }
    } else if (text[i] == '{') {
      if (startCmd != -1) {
        body.editAsText().setAttributes(startCmd, i - 1, colorCmd);
        startCmd = -1;
      }
      body.editAsText().setAttributes(i, i, colorCurly);
    } else if (text[i] == '}') {
      body.editAsText().setAttributes(i, i, colorCurly);
    } else if (text[i] == "$") {
      if (startEqn != -1) {
        body.editAsText().setAttributes(startEqn, i + 1, colorEqn);
        startEqn = -1;
      } else {
        startEqn = i;
      }
    } else if (text[i] == "%") {
      startCmt = i;
    }  else if (text[i] == "\n") {
      if (startCmt != -1) {
        body.editAsText().setAttributes(startCmt, i - 1, colorCmt);
        startCmt =-1;
      } else if (startCmd != -1) {
        body.editAsText().setAttributes(startCmd, i - 1, colorCmd);
        startCmd = -1;
      }
    } else if (text[i] == ' '
            || text[i] == '\f'
            || text[i] == '\r'
            || text[i] == '\t'
            || text[i] == '\v') {
      if (startCmd != -1) {
        body.editAsText().setAttributes(startCmd, i - 1, colorCmd);
        startCmd = -1;
      }
    } else if (!/^[a-zA-Z]$/.test(text[i])) {
      if (startCmd != -1) {
        body.editAsText().setAttributes(startCmd, i - 1, colorCmd);
        startCmd = -1;
      }
    }
  }
}

function findInPDF() {
  var cursorText = DocumentApp.getActiveDocument().getCursor().getSurroundingText().getText();
  var body = DocumentApp.getActiveDocument().getBody().getParagraphs();
  var lineNumber = 0;
  for (lineNumber = 0; lineNumber < body.length; lineNumber++) {
    par = body[lineNumber].getText();
    if (par == cursorText) {
      break;
    }
  }
  return lineNumber;
}

function highlightLine(lineNumber) {
  var line = Number(lineNumber) - 1;
  var doc = DocumentApp.getActiveDocument();
  doc.setCursor(doc.newPosition(doc.getBody().getParagraphs()[line], 0));
  return doc.getBody().getParagraphs()[line].editAsText().setBackgroundColor("#FFFF00");
}

function unhighlightLine(lineNumber) {
  var line = Number(lineNumber) - 1;
  var doc = DocumentApp.getActiveDocument();
  return doc.getBody().getParagraphs()[line].editAsText().setBackgroundColor(null);
}

function refreshSidebar() {
  var html = HtmlService.createTemplateFromFile('newSidebar');
  html.fileId = DocumentApp.getActiveDocument().getId();
  html.fileName = DocumentApp.getActiveDocument().getName();
  return DocumentApp.getUi().showSidebar(html.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL));
}

function startGLaTeX() {
  setupPage();
  refreshSidebar();
  refreshSidebar();//this adjusts explore icon collusion.
}

function symbolDict915(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Gamma").setAttributes(colorCmd);}
function symbolDict916(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Delta").setAttributes(colorCmd);}
function symbolDict920(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Theta").setAttributes(colorCmd);}
function symbolDict923(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Lambda").setAttributes(colorCmd);}
function symbolDict926(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Xi").setAttributes(colorCmd);}
function symbolDict928(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Pi").setAttributes(colorCmd);}
function symbolDict931(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Sigma").setAttributes(colorCmd);}
function symbolDict933(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Upsilon").setAttributes(colorCmd);}
function symbolDict934(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Phi").setAttributes(colorCmd);}
function symbolDict936(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Psi").setAttributes(colorCmd);}
function symbolDict937(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Omega").setAttributes(colorCmd);}
function symbolDict945(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\alpha").setAttributes(colorCmd);}
function symbolDict946(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\beta").setAttributes(colorCmd);}
function symbolDict947(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\gamma").setAttributes(colorCmd);}
function symbolDict948(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\delta").setAttributes(colorCmd);}
function symbolDict949(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\epsilon").setAttributes(colorCmd);}
function symbolDict950(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\zeta").setAttributes(colorCmd);}
function symbolDict951(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\eta").setAttributes(colorCmd);}
function symbolDict952(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\theta").setAttributes(colorCmd);}
function symbolDict953(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\iota").setAttributes(colorCmd);}
function symbolDict954(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\kappa").setAttributes(colorCmd);}
function symbolDict955(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\lambda").setAttributes(colorCmd);}
function symbolDict956(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\mu").setAttributes(colorCmd);}
function symbolDict957(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\nu").setAttributes(colorCmd);}
function symbolDict958(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\xi").setAttributes(colorCmd);}
function symbolDict960(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\pi").setAttributes(colorCmd);}
function symbolDict961(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\rho").setAttributes(colorCmd);}
function symbolDict963(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\sigma").setAttributes(colorCmd);}
function symbolDict964(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\tau").setAttributes(colorCmd);}
function symbolDict965(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\upsilon").setAttributes(colorCmd);}
function symbolDict966(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\phi").setAttributes(colorCmd);}
function symbolDict967(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\chi").setAttributes(colorCmd);}
function symbolDict968(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\psi").setAttributes(colorCmd);}
function symbolDict969(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\omega").setAttributes(colorCmd);}
function symbolDict8592(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\leftarrow").setAttributes(colorCmd);}
function symbolDict8593(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\uparrow").setAttributes(colorCmd);}
function symbolDict8594(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\rightarrow").setAttributes(colorCmd);}
function symbolDict8595(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\downarrow").setAttributes(colorCmd);}
function symbolDict8596(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\leftrightarrow").setAttributes(colorCmd);}
function symbolDict8597(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\updownarrow").setAttributes(colorCmd);}
function symbolDict8598(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\nwarrow").setAttributes(colorCmd);}
function symbolDict8599(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\nearrow").setAttributes(colorCmd);}
function symbolDict8600(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\searrow").setAttributes(colorCmd);}
function symbolDict8601(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\swarrow").setAttributes(colorCmd);}
function symbolDict8656(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Leftarrow").setAttributes(colorCmd);}
function symbolDict8657(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Uparrow").setAttributes(colorCmd);}
function symbolDict8658(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Rightarrow").setAttributes(colorCmd);}
function symbolDict8659(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Downarrow").setAttributes(colorCmd);}
function symbolDict8660(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Leftrightarrow").setAttributes(colorCmd);}
function symbolDict8661(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\Updownarrow").setAttributes(colorCmd);}
function symbolDict8652(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\rightleftharpoons").setAttributes(colorCmd);}
function symbolDict8734(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\infty").setAttributes(colorCmd);}
function symbolDict8704(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\forall").setAttributes(colorCmd);}
function symbolDict8706(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\partial").setAttributes(colorCmd);}
function symbolDict8707(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\exists").setAttributes(colorCmd);}
function symbolDict8708(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\nexists").setAttributes(colorCmd);}
function symbolDict8709(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\varnothing").setAttributes(colorCmd);}
function symbolDict8710(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\triangle").setAttributes(colorCmd);}
function symbolDict8711(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\nabla").setAttributes(colorCmd);}
function symbolDict8712(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\in").setAttributes(colorCmd);}
function symbolDict8713(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\notin").setAttributes(colorCmd);}
function symbolDict8719(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\prod").setAttributes(colorCmd);}
function symbolDict8721(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\sum").setAttributes(colorCmd);}
function symbolDict8730(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\sqrt{}").setAttributes(colorCmd);}
function symbolDict8747(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\int").setAttributes(colorCmd);}
function symbolDict8748(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\iint").setAttributes(colorCmd);}
function symbolDict8749(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\iiint").setAttributes(colorCmd);}
function symbolDict8750(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\oint").setAttributes(colorCmd);}
function symbolDict8751(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\oiint").setAttributes(colorCmd);}
function symbolDict8752(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\oiiint").setAttributes(colorCmd);}
function symbolDict8764(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\tilde").setAttributes(colorCmd);}
function symbolDictlim(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\lim").setAttributes(colorCmd);}
function symbolDict8723(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\pm").setAttributes(colorCmd);}
function symbolDict8743(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\wedge").setAttributes(colorCmd);}
function symbolDict8744(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\vee").setAttributes(colorCmd);}
function symbolDict8745(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\cap").setAttributes(colorCmd);}
function symbolDict8746(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\cup").setAttributes(colorCmd);}
function symbolDict247(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\div").setAttributes(colorCmd);}
function symbolDict215(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\times").setAttributes(colorCmd);}
function symbolDict8773(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\cong").setAttributes(colorCmd);}
function symbolDict8801(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\equiv").setAttributes(colorCmd);}
function symbolDict8804(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\leq").setAttributes(colorCmd);}
function symbolDict8805(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\geq").setAttributes(colorCmd);}
function symbolDict8834(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\subset").setAttributes(colorCmd);}
function symbolDict8835(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\supset").setAttributes(colorCmd);}
function symbolDict8838(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\subseteq").setAttributes(colorCmd);}
function symbolDict8839(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\supseteq").setAttributes(colorCmd);}
function symbolDict8853(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\oplus").setAttributes(colorCmd);}
function symbolDict8855(){var colorCmd = {}; colorCmd[DocumentApp.Attribute.FOREGROUND_COLOR] = '#003262'; DocumentApp.getActiveDocument().getCursor().insertText("\\otimes").setAttributes(colorCmd);}

function envArray(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{array}{}\n\n\\end{array}");}
function envCenter(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{center}\n\n\\end{center}");}
function envDesc(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{description}\n\\item\n\\end{description}");}
function envEnum(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{enumerate}\n\item\n\\end{enumerate}");}
function envEqnArray(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{eqnarray}\n\n\\end{eqnarray}");}
function envEqn(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{equation}\n\n\\end{equation}");}
function envEqns(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{equation*}\n\n\\end{equation*}");}
function envFig(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{figure}[]\n\n\\end{figure}");}
function envFlushL(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{flushleft}\n\n\\end{flushleft}");}
function envFlushR(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{flushright}\n\n\\end{flushright}");}
function envItem(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{itemize}\n\n\\end{itemize}");}
function envList(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{list}{}{}\n\n\\end{list}");}
function envMiniPage(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{minipage}[]{}\n\n\\end{minipage}");}
function envPic(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{picture}(,)(,)\n\n\\end{picture}");}
function envQuotation(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{quotation}\n\n\\end{quotation}");}
function envQuote(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{quote}\n\n\\end{quote}");}
function envTabbing(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{tabbing}\n\n\\end{tabbing}");}
function envTable(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{table}[]\n\n\\end{table}");}
function envTabular(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{tabular}[]{}\n\n\\end{tabular}");}
function envTabulars(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{tabular*}{}[]{}\n\n\\end{tabular*}");}
function envBib(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{thebibliography}{}\n\\bibitem[]{}\n\\end{thebibliography}");}
function envTheorem(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{theorem}\n\n\\end{theorem}");}
function envTitlePage(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{titlepage}\n\n\\end{titlepage}");}
function envVerbatim(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{verbatim}\n\n\\end{verbatim}");}
function envVerse(){DocumentApp.getActiveDocument().getCursor().insertText("\\begin{verse}\n\n\\end{verse}");}

function onOpen(e) {
  var ui = DocumentApp.getUi();
  var i;
  var greeks = ui.createMenu("Greek letters");
  var greeksUpper = ui.createMenu("Upper Case");
  var greeksLower = ui.createMenu("Lower Case");
  var arrows = ui.createMenu("Arrows");
  var miscellaneous = ui.createMenu("Miscellaneous");
  var relations = ui.createMenu("Relations");
  greeksUpper.addItem(String.fromCharCode(915), "symbolDict915");
  greeksUpper.addItem(String.fromCharCode(916), "symbolDict916");
  greeksUpper.addItem(String.fromCharCode(920), "symbolDict920");
  greeksUpper.addItem(String.fromCharCode(923), "symbolDict923");
  greeksUpper.addItem(String.fromCharCode(926), "symbolDict926");
  greeksUpper.addItem(String.fromCharCode(928), "symbolDict928");
  greeksUpper.addItem(String.fromCharCode(931), "symbolDict932");
  greeksUpper.addItem(String.fromCharCode(933), "symbolDict933");
  greeksUpper.addItem(String.fromCharCode(934), "symbolDict934");
  greeksUpper.addItem(String.fromCharCode(936), "symbolDict936");
  greeksUpper.addItem(String.fromCharCode(937), "symbolDict937");
  for (i = 945; i <= 969; i++) {
    if (i == 962 || i == 959)
      continue;
    greeksLower.addItem(String.fromCharCode(i), "symbolDict" + i);
  }
  greeks.addSubMenu(greeksUpper).addSubMenu(greeksLower);
  for (i = 8592; i <= 8601; i++) {
    arrows.addItem(String.fromCharCode(i), "symbolDict" + i);
  }
  for (i = 8656; i <= 8661; i++) {
    arrows.addItem(String.fromCharCode(i), "symbolDict" + i);
  }
  arrows.addItem(String.fromCharCode(8652), "symbolDict8652");
  miscellaneous.addItem(String.fromCharCode(8734), "symbolDict8734");
  miscellaneous.addItem(String.fromCharCode(8704), "symbolDict8704");
  miscellaneous.addItem(String.fromCharCode(8706), "symbolDict8706");
  miscellaneous.addItem(String.fromCharCode(8707), "symbolDict8707");
  miscellaneous.addItem(String.fromCharCode(8708), "symbolDict8708");
  miscellaneous.addItem(String.fromCharCode(8709), "symbolDict8709");
  miscellaneous.addItem(String.fromCharCode(8710), "symbolDict8710");
  miscellaneous.addItem(String.fromCharCode(8711), "symbolDict8711");
  miscellaneous.addItem(String.fromCharCode(8712), "symbolDict8712");
  miscellaneous.addItem(String.fromCharCode(8713), "symbolDict8713");
  miscellaneous.addItem(String.fromCharCode(8719), "symbolDict8719");
  miscellaneous.addItem(String.fromCharCode(8721), "symbolDict8721");
  miscellaneous.addItem(String.fromCharCode(8730), "symbolDict8730");
  miscellaneous.addItem(String.fromCharCode(8747), "symbolDict8747");
  miscellaneous.addItem(String.fromCharCode(8748), "symbolDict8748");
  miscellaneous.addItem(String.fromCharCode(8749), "symbolDict8749");
  miscellaneous.addItem(String.fromCharCode(8750), "symbolDict8750");
  miscellaneous.addItem(String.fromCharCode(8751), "symbolDict8751");
  miscellaneous.addItem(String.fromCharCode(8752), "symbolDict8752");
  miscellaneous.addItem(String.fromCharCode(8764), "symbolDict8764");
  miscellaneous.addItem("lim", "symbolDictlim");
  relations.addItem(String.fromCharCode(8723), "symbolDict8723");
  relations.addItem(String.fromCharCode(247), "symbolDict247");
  relations.addItem(String.fromCharCode(215), "symbolDict215");
  relations.addItem(String.fromCharCode(8743), "symbolDict8743");
  relations.addItem(String.fromCharCode(8744), "symbolDict8744");
  relations.addItem(String.fromCharCode(8745), "symbolDict8745");
  relations.addItem(String.fromCharCode(8746), "symbolDict8746");
  relations.addItem(String.fromCharCode(8773), "symbolDict8773");
  relations.addItem(String.fromCharCode(8801), "symbolDict8801");
  relations.addItem(String.fromCharCode(8804), "symbolDict8804");
  relations.addItem(String.fromCharCode(8805), "symbolDict8805");
  relations.addItem(String.fromCharCode(8834), "symbolDict8834");
  relations.addItem(String.fromCharCode(8835), "symbolDict8835");
  relations.addItem(String.fromCharCode(8838), "symbolDict8838");
  relations.addItem(String.fromCharCode(8839), "symbolDict8839");
  relations.addItem(String.fromCharCode(8853), "symbolDict8853");
  relations.addItem(String.fromCharCode(8855), "symbolDict8855");
  var symDict = ui.createMenu("Symbol Dictionary").addSubMenu(greeks).addSubMenu(arrows).addSubMenu(miscellaneous).addSubMenu(relations);
  
  
  
  
  var envs = ui.createMenu("LaTeX Environments");
  envs.addItem("array", "envArray");
  envs.addItem("center", "envCenter");
  envs.addItem("description", "envDesc");
  envs.addItem("enumerate", "envEnum");
  envs.addItem("eqnarray", "envEqnArray");
  envs.addItem("equation", "envEqn");
  envs.addItem("equation*", "envEqns");
  envs.addItem("figure", "envFig");
  envs.addItem("flushleft", "envFlushL");
  envs.addItem("flushright", "envFlushR");
  envs.addItem("itemize", "envItem");
  envs.addItem("list", "envList");
  envs.addItem("minipage", "envMiniPage");
  envs.addItem("picture", "envPic");
  envs.addItem("quotation", "envQuotation");
  envs.addItem("quote", "envQuote");
  envs.addItem("tabbing", "envTabbing");
  envs.addItem("table", "envTable");
  envs.addItem("tabular", "envTabular");
  envs.addItem("tabular*", "envTabulars");
  envs.addItem("thebibliography", "envBib");
  envs.addItem("theorem", "envTheorem");
  envs.addItem("titlepage", "envTitlePage");
  envs.addItem("verbatim", "envVerbatim");
  envs.addItem("verse", "envVerse");
  ui.createAddonMenu().addItem('Start GLaTeX', 'startGLaTeX').addItem('Refresh Sidebar', 'refreshSidebar').addItem('Color Syntax', 'colorSyntax').addSubMenu(symDict).addSubMenu(envs).addToUi();
}

function onInstall(e) {
  onOpen(e);
}
