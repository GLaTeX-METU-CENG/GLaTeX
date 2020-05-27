import os
import io
import json
import subprocess
from time import mktime
from httplib2 import Http
from datetime import datetime
from glatex.settings import CWD
from oauth2client import client
from glatex_app.models import *
from PyPDF2 import PdfFileReader
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import HttpResponse
from googleapiclient.discovery import build
from django.views.generic.edit import CreateView
from django.views.decorators.csrf import csrf_exempt
from googleapiclient.http import MediaIoBaseDownload

data_folder = CWD + "user_data/"

def index(request):
    if request.method == "GET":
        return render(request, 'index.html')

def privacy_policy(request):
    if request.method == "GET":
        return render(request, 'privacy_policy.html')

def terms_of_service(request):
    if request.method == "GET":
        return render(request, 'terms_of_service.html')

def alive(request):
    if request.method == "GET":
        return HttpResponse()

def view(request, file_id, file_name):
    try:
        pk = str(Pdf.objects.get(file_id=file_id).pk)
        tex_pdf = data_folder + pk + "/" + file_name + ".pdf"
        with open(tex_pdf,'rb') as pdf:
            response = HttpResponse(pdf.read(), content_type='application/pdf')
            return response
    except:
        tex_pdf = CWD + "static/assets/start_page.pdf"
        with open(tex_pdf,'rb') as pdf:
            response = HttpResponse(pdf.read(), content_type='application/pdf')
            return response

@csrf_exempt
def git_pull(request):
    p = subprocess.Popen(['/bin/bash',CWD+'/gitpull.sh'])
    return render(request, 'gitpull.html')

def tex(request, file_id, file_name, pos):
    try:
        pk = str(Pdf.objects.get(file_id=file_id).pk)
        w, h = 1, 1
        os.chdir(data_folder + pk)
        with open(file_name + ".pdf", 'rb') as f:
            _, _ , w, h = inp = PdfFileReader(f).getPage(0).mediaBox
        os.chdir(CWD)
        pos = list(map(lambda x: float(x), pos.split(":")))
        pos = str(int(pos[0])) + ":" + str(int(round(pos[1]*float(w)))) + ":" + str(int(round(pos[2]*float(h))))
        os.chdir(data_folder + pk)
        output = subprocess.check_output("synctex edit -o " + pos + ":" + file_name.replace(" ", "\ ") + ".pdf" , shell=True)
        os.chdir(CWD)
        matching_line = output.decode().split("Line:")[1].split("\n")[0].encode()
        return HttpResponse(matching_line, content_type="text/plain")
    except:
        return HttpResponse("TeX Matching Error!", content_type="text/plain")

def pdf(request, file_id, file_name, lineNumber):
    try:
        pk = str(Pdf.objects.get(file_id=file_id).pk)
        lineNumber = str(int(lineNumber) + 1)
        pages = {}
        temp_file_name = file_name.replace(" ", "\ ")
        os.chdir(data_folder + pk)
        temp = subprocess.check_output("synctex view -i " + lineNumber + ":0:" + temp_file_name + ".tex" + " -o " + temp_file_name + ".pdf", shell=True).decode().split("\n")
        os.chdir(CWD)
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
        os.chdir(data_folder + pk)
        with open(file_name + ".pdf", 'rb') as f:
            _, _ , w, h = inp = PdfFileReader(f).getPage(0).mediaBox
        os.chdir(CWD)
        highlight = "|".join(map(lambda x: str(x), highlight + [w, h]))
        return HttpResponse(highlight, content_type="text/plain")
    except:
        return HttpResponse("PDF Matching Error!", content_type="text/plain")

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

@csrf_exempt
def compile(request, file_id, file_name):
    if request.method == 'POST':
        access_token = request.body.decode("utf-8")
        try:
            pk = str(Pdf.objects.get(file_id=file_id).pk)
        except:
            pk = str(Pdf.objects.create(file_id=file_id).pk)
            try:
                os.mkdir(data_folder + pk)
            except:
                pass
        try:
            credentials = client.AccessTokenCredentials(access_token, 'null')
            http = credentials.authorize(Http())
            drive = build('drive', 'v3', http=http)
        except:
            return HttpResponse("Authentication Error!", content_type="text/plain")
        try:
            try:
                folder_id = drive.files().get(fileId=file_id, fields="parents").execute()["parents"][0]
                folder_name = drive.files().get(fileId=folder_id).execute()["name"]
                if folder_name == "My Drive":
                    request = drive.files().export(fileId=file_id, mimeType='text/plain')
                    download_chunks(request, data_folder + pk + "/" + file_name + ".tex", True)
                else:
                    os.chdir(data_folder + pk)
                    download_folder(drive, folder_id)
                    os.chdir(CWD)
            except:
                request = drive.files().export(fileId=file_id, mimeType='text/plain')
                download_chunks(request, data_folder + pk + "/" + file_name + ".tex", True)
        except:
            return HttpResponse("Drive API Error!", content_type="text/plain")
        try:
            tex = data_folder + pk + "/" + file_name + ".tex"
            with open(tex, "rb") as f:
                content = f.read().decode("utf-8").replace("\n\n", "\n").encode("utf-8")
                with open(tex, "wb+") as f:
                    f.write(content)
        except:
            return HttpResponse("TeX File Error!", content_type="text/plain")
        try:
            with open(data_folder + pk + "/stdout.txt","wb+") as out, open(data_folder + pk + "/stderr.txt","wb+") as err:
                os.chdir(data_folder + pk)
                p = subprocess.Popen("pdflatex" + " --synctex=1 " + file_name.replace(" ", "\ ") + ".tex", shell=True, stdout=out, stderr=err)
                os.chdir(CWD)
                p.communicate(timeout=2)
        except:
            return HttpResponse("Compilation Error!", content_type="text/plain")
        with open(data_folder + pk + "/stdout.txt", "r") as out:
            lines = out.readlines()
            error_log = ""
            error_flag = False
            for line in lines:
                if line.strip().startswith("!"):
                    error_flag = True
                if error_flag and line:
                    error_log +=  line
            if error_log:
                return HttpResponse("Compilation Error!\n" + error_log, content_type="text/plain")
        return HttpResponse("Success!", content_type="text/plain")

def download(request, file_id, file_name):
    try:
        pk = str(Pdf.objects.get(file_id=file_id).pk)
        tex_pdf = data_folder + pk + "/" + file_name + ".pdf"
        with open(tex_pdf,'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = "attachment; filename=" + file_name + ".pdf"
            return response
    except:
        tex_pdf = CWD + "static/assets/start_page.pdf"
        with open(tex_pdf,'rb') as pdf:
            response = HttpResponse(pdf.read(),content_type='application/pdf')
            response['Content-Disposition'] = "attachment; filename=glatex.pdf"
            return response

