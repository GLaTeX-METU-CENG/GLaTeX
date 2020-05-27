function initPDFViewer() {
  pdfjsLib.getDocument(viewUrl).then(pdf => {
    pdfInstance = pdf;
    totalPagesCount = pdf.numPages;
    render();
  });
}

function findInPDF() {
  parent.postMessage("findInPDF", "*");
  findInPDFRequestSent = true;
}

function prev() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
  }
  render();
}

function next() {
  if (currentPageIndex < totalPagesCount - 1) {
    currentPageIndex++;
  }
  render();
}

function zoomOut() {
  zoomScale -= zoomStep;
  render();
}

function zoomIn() {
  zoomScale += zoomStep;
  render();
}

function render() {
  const startPageIndex = currentPageIndex;
  const endPageIndex = currentPageIndex;
  pdfInstance.getPage(currentPageIndex + 1).then(page => {
    let pdfViewport = page.getViewport(0.4);
    const container = viewport.children[page.pageIndex - currentPageIndex];
    pdfViewport = page.getViewport(container.offsetWidth / pdfViewport.width);
    const canvas = container.children[0];
    const context = canvas.getContext("2d");
    canvas.height = pdfViewport.height;
    canvas.width = pdfViewport.width;
    canvas.style.height = zoomScale + "%";
    canvas.style.width = zoomScale + "%";
    page.render({
      canvasContext: context,
      viewport: pdfViewport
    }).then(PDFloaded());
  });
}

function renderWithHighlight(highlightPosition) {
  highlightPosition = highlightPosition.split("|").map(Number);
  currentPageIndex = Number(highlightPosition[0]) - 1;
  const startPageIndex = currentPageIndex;
  const endPageIndex = currentPageIndex;
  pdfInstance.getPage(currentPageIndex + 1).then(page => {
    let pdfViewport = page.getViewport(0.4);
    const container = viewport.children[page.pageIndex - currentPageIndex];
    pdfViewport = page.getViewport(container.offsetWidth / pdfViewport.width);
    const canvas = container.children[0];
    const context = canvas.getContext("2d");
    canvas.height = pdfViewport.height;
    canvas.width = pdfViewport.width;
    canvas.style.height = zoomScale + "%";
    canvas.style.width = zoomScale + "%";
    renderTask = page.render({
      canvasContext: context,
      viewport: pdfViewport
    });
    renderTask.promise.then(function () {
      page = context.getImageData(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "green";
      context.lineWidth = 5;
      var x = highlightPosition[1]/highlightPosition[5]*canvas.width;
      var y = highlightPosition[2]/highlightPosition[6]*canvas.height;
      var w = highlightPosition[3]/highlightPosition[5]*canvas.width;
      var h = highlightPosition[4]/highlightPosition[6]*canvas.height;
      context.strokeRect(20, y - h, canvas.width - 40, 2*h);
      PDFloaded();
    });
  });
}

function mouseEvent(event) {
  if (shiftPressed && event.target == document.getElementById("pdf")) {
    var zoomRatio = zoomScale/100;
    var position = currentPageIndex + 1 + ":" + event.offsetX/(sidebarWidth*zoomRatio) + ":" + event.offsetY/(sidebarHeight*zoomRatio);
    var request = new XMLHttpRequest();
    request.onload = function() {
      if (this.response != "error") {
        parent.postMessage(this.response, "*");
      }
    };
    request.open("GET", texUrl + position, true);
    request.send();
  }  
}

function download() {
  var a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName + ".pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function shiftPress(event) {
  if (event.shiftKey) {
    shiftPressed = true; 
  }
}

function shiftRelease(event) {
  if (shiftPressed && !event.shiftKey) {
    shiftPressed = false;
  }
}

function switchHandler(e){
  if(e.checked) {
    document.getElementById("toolbar").style.background = "#404040";
    document.getElementById("viewport-container").style.background = "#202020";
    document.getElementById("pdf").style.filter = "invert(100%)";
  } else {
    document.getElementById("toolbar").style.background = "#C0C0C0";
    document.getElementById("viewport-container").style.background = "#F0F0F0";
    document.getElementById("pdf").style.filter = "invert(0%)";
  }
}

function localHandler(e){
  if(e.checked) {
    viewUrl = "http://localhost:8001/" + fileId + "/" + fileName + "/view";
    downloadUrl = "http://localhost:8001/" + fileId + "/" + fileName + "/download";
    texUrl = "http://localhost:8001/" + fileId + "/" + fileName + "/tex/";
    pdfUrl = "http://localhost:8001/" + fileId + "/" + fileName + "/pdf/";
    compileUrl = "http://localhost:8001/" + fileId + "/" + fileName + "/compile";
  } else {
    viewUrl = url + userId + "/" + fileId + "/" + fileName + "/view";
    downloadUrl = url + userId + "/" + fileId + "/" + fileName + "/download";
    texUrl = url + userId + "/" + fileId + "/" + fileName + "/tex/";
    pdfUrl = url + userId + "/" + fileId + "/" + fileName + "/pdf/";
    compileUrl = url + userId + "/" + fileId + "/" + fileName + "/compile";
  }
}

function messageReceiver(e) {
  if (findInPDFRequestSent && /^\d+$/.test(e.data) && e.data != "error") {
    findInPDFRequestSent = false;
    var request = new XMLHttpRequest();
    request.onload = function() {
      renderWithHighlight(this.response);
      setTimeout(function(){ render(); }, 4000);
    };
    request.open("GET", pdfUrl + e.data, true);
    request.send();
  } else if (authRequestSent && e.data.length > randomKeyLength && e.data != "error") {
    authRequestSent = false;
    var request = new XMLHttpRequest();
    request.onload = function() {
      initPDFViewer();
    };
    request.open("POST", compileUrl, true);
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    request.send(e.data.substring(0, e.data.length - randomKeyLength));
    loadPDF();
  }
}

function loadPDF() {
  loader.style.display = "block";
  viewport.style.visibility = "hidden";
}

function PDFloaded() {
  loader.style.display = "none";
  viewport.style.visibility = "visible";
}

function compile(){
  randomKeyLength = Math.floor(Math.random() * 100);
  parent.postMessage("_" + randomKeyLength, "*");
  randomKeyLength += 17;
  authRequestSent = true;
}

function myPageload() {
  loadPDF();
  initPDFViewer();
}

