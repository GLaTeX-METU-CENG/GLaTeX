import os
import io
import sys
import json
import struct
import subprocess
from time import mktime
from httplib2 import Http
from datetime import datetime
from oauth2client import client
from PyPDF2 import PdfFileReader
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from http.server import BaseHTTPRequestHandler, HTTPServer

CWD = os.getcwd() + "/"
data_folder = CWD + "user_data/"
default_pdf = data_folder + "start_page.pdf"

def find(name):
    path = ""
    filename = os.getcwd() +"/"+ name + "Path.txt"
    if path == "":
        with open(filename,"w+") as f:
            subprocess.call('export PATH="/Library/TeX/texbin:$PATH"; which ' + name, shell=True,stdout=f, stderr=f)
    
        with open(filename, "r") as f:
            path = f.readline()
    
    return path

def download_chunks(request, file_name, is_tex):
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    if is_tex:
        with open(file_name, "wb+") as f:
            f.write(fh.getbuffer().tobytes().decode("utf-8-sig").encode("utf-8"))
    else:
        with open(file_name, "wb+") as f:
            f.write(fh.getbuffer())
    return

def download_folder(drive, folder_id):
    folder = drive.files().list(q="'" + folder_id + "' in parents", fields="files(id, name, mimeType, modifiedTime, createdTime)").execute()["files"]
    for file in folder:
        if file["mimeType"] == "application/vnd.google-apps.document":
            request = drive.files().export(fileId=file["id"], mimeType='text/plain')
            download_chunks(request, file["name"] + ".tex", True)
        elif file["mimeType"] == "application/vnd.google-apps.folder":
            try:
                os.mkdir(file["name"])
            except:
                pass
            os.chdir(file["name"])
            download_folder(drive, file["id"])
            os.chdir("../")
        else:
            image = file["name"]
            modified_time = mktime(datetime.strptime(file["modifiedTime"], '%Y-%m-%dT%H:%M:%S.%fZ').timetuple())
            try:
                t = os.path.getmtime(image)
            except:
                t = None
            if modified_time != t:
                request = drive.files().get_media(fileId=file["id"])
                download_chunks(request, image, False)
                try:
                    os.utime(image, (modified_time, modified_time))
                except:
                    pass
    return

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = self.path
        if url == "/":
            self.send_response(200)
            self.end_headers()
        elif "alive" in url:
            self.send_response(200)
            self.end_headers()
        elif "view" in url:
            _, file_id, file_name, _ = url.split("/")
            file_name = file_name.replace("%20", " ")
            pdf = data_folder + file_name + ".pdf"
            self.send_response(200)
            self.send_header('Content-type', 'application/pdf')
            self.end_headers()
            try:
                with open(pdf,'rb') as f:
                    content = f.read()
                    if content:
                        self.wfile.write(content)
                        return
                    else:
                        raise
            except:
                with open(default_pdf,'rb') as f:
                    self.wfile.write(f.read())
                    return
        elif "download" in url:
            _, file_id, file_name, _ = url.split("/")
            file_name = file_name.replace("%20", " ")
            pdf = data_folder + file_name + ".pdf"
            self.send_response(200)
            self.send_header('Content-Disposition','attachment; filename="' + file_name + '.pdf"')
            self.end_headers()
            try:
                with open(pdf,'rb') as f:
                    content = f.read()
                    if content:
                        self.wfile.write(content)
                        return
                    else:
                        raise
            except:
                with open(default_pdf,'rb') as f:
                    self.wfile.write(f.read())
                    return
        elif "tex" in url:
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            _, file_id, file_name, _, pos = url.split("/")
            file_name = file_name.replace("%20", " ")
            w, h = 1, 1
            pdf = data_folder + file_name + ".pdf"
            try:
                with open(pdf, 'rb') as f:
                    _, _ , w, h = inp = PdfFileReader(f).getPage(0).mediaBox
                pos = list(map(lambda x: float(x), pos.split(":")))
                pos = str(int(pos[0])) + ":" + str(int(round(pos[1]*float(w)))) + ":" + str(int(round(pos[2]*float(h))))
                os.chdir(data_folder)
                output = subprocess.Popen(str(find("synctex")).strip() + " edit -o " + pos + ":" +  file_name.replace(" ", "\ ") + ".pdf", shell=True, stdout=subprocess.PIPE)
                os.chdir(CWD)
                matching_line = output.communicate(timeout=2)[0].decode().split("Line:")[1].split("\n")[0].encode()
                self.wfile.write(matching_line)
                return
            except:
                self.wfile.write(b"TeX Matching Error!")
                return
        elif "pdf" in url:
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            _, file_id, file_name, _, lineNumber = url.split("/")
            file_name = file_name.replace("%20", " ")
            lineNumber = str(int(lineNumber) + 1)
            pages = {}
            tex = data_folder + file_name + ".tex"
            pdf = data_folder + file_name + ".pdf"
            try:
                temp_file_name = file_name.replace(" ", "\ ")
                os.chdir(data_folder)
                output = subprocess.Popen(str(find("synctex")).strip() + " view -i " + lineNumber + ":0:" + temp_file_name + ".tex" + " -o " + temp_file_name + ".pdf", shell=True, stdout=subprocess.PIPE)
                os.chdir(CWD)
                temp = output.communicate(timeout=2)[0].decode().split("\n")
                p = 0
                for j in temp:
                    if "Page:" in j:
                        p = int(j[5:])
                        if p not in pages.keys():
                            pages[p] = {"x":[], "y":[], "w":[], "h":[]}
                    elif "x:" in j:
                        pages[p]["x"].append(float(j[2:]))
                    elif "y:" in j:
                        pages[p]["y"].append(float(j[2:]))
                    elif "W:" in j:
                        pages[p]["w"].append(float(j[2:]))
                    elif "H:" in j:
                        pages[p]["h"].append(float(j[2:]))
                highlight = [p, min(pages[p]["x"]), min(pages[p]["y"]), max(pages[p]["w"]), max(pages[p]["h"])]
                w, h = 0, 0
                with open(pdf, 'rb') as f:
                    _, _ , w, h = inp = PdfFileReader(f).getPage(0).mediaBox
                highlight = "|".join(map(lambda x: str(x), highlight + [w, h]))
                self.wfile.write(highlight.encode())
                return
            except:
                self.wfile.write(b"PDF Matching Error!")
                return

    def do_POST(self):
        url = self.path
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        if "compile" in url:
            _, file_id, file_name, _ = url.split("/")
            file_name = file_name.replace("%20", " ")
            content_length = int(self.headers['Content-Length'])
            access_token = self.rfile.read(content_length).decode()
            try:
                credentials = client.AccessTokenCredentials(access_token, 'null')
                http = credentials.authorize(Http())
                drive = build('drive', 'v3', http=http)
            except:
                self.wfile.write(b"Authentication Error!")
                return
            try:
                try:
                    folder_id = drive.files().get(fileId=file_id, fields="parents").execute()["parents"][0]
                    folder_name = drive.files().get(fileId=folder_id).execute()["name"]
                    if folder_name == "My Drive":
                        request = drive.files().export(fileId=file_id, mimeType='text/plain')
                        download_chunks(request, data_folder + file_name + ".tex", True)
                    else:
                        os.chdir(data_folder)
                        download_folder(drive, folder_id)
                        os.chdir(CWD)
                except:
                    request = drive.files().export(fileId=file_id, mimeType='text/plain')
                    download_chunks(request, data_folder + file_name + ".tex", True)
            except:
                self.wfile.write(b"Drive API Error!")
                return
            try:
                tex = data_folder + file_name + ".tex"
                with open(tex, "r") as f:
                    content = f.read().replace("\n\n", "\n")
                    with open(tex, "w+") as f:
                        f.write(content)
            except:
                self.wfile.write(b"TeX File Error!")
                return
            try:
                with open(data_folder + "stdout.txt","wb") as out, open(data_folder + "stderr.txt","wb") as err:
                    os.chdir(data_folder)
                    p = subprocess.Popen(str(find("pdflatex")).strip() + " --synctex=1 " + file_name.replace(" ", "\ ") + ".tex", shell=True, stdout=out, stderr=err)
                    os.chdir(CWD)
                    p.communicate(timeout=2)
            except:
                self.wfile.write(b"Compilation Error!")
                return
            with open(data_folder + "stdout.txt", "r") as out:
                lines = out.readlines()
                error_log = ""
                error_flag = False
                for line in lines:
                    if line.strip().startswith("!"):
                        error_flag = True
                    if error_flag and line:
                        error_log +=  line
                if error_flag:
                    self.wfile.write(b"Compilation Error!\n" + error_log.encode())
                    return
        self.wfile.write(b"Success!")
        return

    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        BaseHTTPRequestHandler.end_headers(self)


def startScript():
    server_address = ('127.0.0.1', 8001)
    httpd = HTTPServer(server_address, MyHandler)
    httpd.serve_forever()


def Main():
    startScript()
    sys.exit(0)


if __name__ == '__main__':
    sys.stdout = open("nativeapplog.txt","w+")
    sys.stderr = open("nativeapperrorlog.txt","w+")
    Main()

