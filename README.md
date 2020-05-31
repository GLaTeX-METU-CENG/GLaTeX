# GLaTeX

Developed by: Beyazit Yalcinkaya, Sina Sehlaver, and Sena Terzi.

GLaTeX is a collaborative LaTeX editor built on top of Google Docs. By using Google Docs, it inherits user-friendly features of Google Docs such as, version history checking, task assignment, notification, and commenting. Although some of the opponents offer these features, most of them offer these as paid. On top of these, our prominent feature is the local compilation option. GLaTeX offers its users to compile their LaTeX files locally without being interrupted by network problems. Users can also edit their LaTeX source code offline. In addition to these main features, GLaTeX offers some other features such as syntax highlighting, TeX to PDF, PDF to TeX spatial matching, and dark themed user interface which is usually preferred by developers.

GLaTeX consists of two main components, i.e., a Google Docs Add-On which will be available on G Suite Marketplace and a Chrome Extension which is available on Chrome Web Store. Combination of these two main components provides a rich user-experience with all functionalities offered by GLaTeX.

GLaTeX Add-on covers most of the main GLaTeX functionalities. Below, features provided by the GLaTeX Add-on are listed.

1. Page setup for a LaTeX-editor-like text look.
2. LaTeX syntax highlighting.
3. LaTeX special symbols dictionary.
4. Standard LaTeX environments dictionary.
5. A sidebar containing compiled PDF file.
6. GLaTeX PDF Viewer inside the sidebar which contains following functionalities
implemented in buttons, keyboard-mouse shortcuts, and switches.
	* Previous-next page buttons and keyboard shortcuts.
	* Zoom out-in buttons and keyboard shortcuts.
	* Compilation button and keyboard shortcut.
	* Find the PDF button and keyboard shortcut.
	* Find in TeX keyboard-mouse combination shortcut.
	* Download PDF button and keyboard shortcut.
	* Server-local compilation switch.
	* Help button.
	* Information boxes triggered on mouse hovers for each item in the PDF viewer.

GLaTeX Add-on is implemented with Google Apps Script (a variation of Javascript adapted for extending Google services), HTML, and Javascript. Google Apps Script codes are executed on Google servers and HTML-Javascript codes are executed on the browsers. Communication between these two components is ensured by special Google API function calls and the communication with the server is provided by HTTP GET-POST requests.

GLaTeX Extension is Google Chrome Extension available on the Chrome Web Store. It assists GLaTeX Add-on to achieve several essential features of the GLaTeX. These features provided by the GLaTeX Extension are listed.

1. Increases the size of the sidebar containing compiled PDF files.
2. Enables local compilation.
3. Offers light and dark themes for Google Docs.

GLaTeX Extension is implemented with HTML, Javascript, Python, and Bash. HTML-Javascript is used for the browser interface of the extension and for the dark theme. Python is used for implementing a local server on the user machine. This local server receives requests from GLaTeX Add-on and serves for all functionalities just like GLaTeX server. Bash is used in the installation script of the local server. The installation script installs all requirements, compiles the local server implementation, and takes care of all adjustments for execution of the local server.

Integration of these two components of the GLaTeX provides all promised functionalities for Linux and MacOS users.

For more information see [GLaTeX webpage](https://senior.ceng.metu.edu.tr/2020/glatex/).

## Contributing

GLaTeX is open for Contribution and it is encouraged. You can send us ansing [email](mailto:glatex22@gmail.com) if you have any questions.

