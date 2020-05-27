import os
import io
import sys
import argparse
import subprocess
from time import mktime
from httplib2 import Http
from datetime import datetime
from oauth2client.file import Storage
from googleapiclient.discovery import build
from oauth2client.tools import run_flow, argparser
from googleapiclient.http import MediaIoBaseDownload
from oauth2client.client import flow_from_clientsecrets

def init():
    global client_secret, file_id, file_name, compile_enabled, folder_enabled
    parser = argparse.ArgumentParser(description="""GLaTeX Command-Line Tool""")
    parser.add_argument("client_secret", type=str, help="""client secret file for
  Drive API, scopes must contain https://www.googleapis.com/auth/drive.readonly
  and the Drive API must be enabled (or you can use following link as a shortcut
  for creating it https://developers.google.com/drive/api/v3/quickstart/python)""")
    parser.add_argument("file_id", type=str, help="ID of the Google Docs document")
    parser.add_argument("-c", "--compile", action="store_true", help="""compile
                                                            downloaded document""")
    parser.add_argument("-f", "--folder", action="store_true", help="""recursively
                                   download parent folder of the given document""")
    args = parser.parse_args()
    client_secret = args.client_secret
    file_id = args.file_id
    compile_enabled = args.compile
    folder_enabled = args.folder
    return

def download_chunks(request, file_name, is_tex):
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    print("Downloading " + file_name)
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
            else:
                print("Passing " + image)
    return

def download():
    global client_secret, file_id, file_name, compile_enabled, folder_enabled
    SCOPE = 'https://www.googleapis.com/auth/drive.readonly'
    try:
        store = Storage("credentials.json")
        credentials = store.get()
        if not credentials or credentials.invalid:
            flow = flow_from_clientsecrets(client_secret, SCOPE)
            credentials = run_flow(flow, store, argparser.parse_args(args=[]))
        http = credentials.authorize(Http())
        drive = build('drive', 'v3', http=http)
        file_name = drive.files().get(fileId=file_id).execute()["name"]
    except:
        print("Authentication Error!")
        sys.exit()
    try:
        if folder_enabled:
            folder_id = drive.files().get(fileId=file_id, fields="parents").execute()["parents"][0]
            folder_name = drive.files().get(fileId=folder_id).execute()["name"]
            try:
                os.mkdir(folder_name)
            except:
                pass
            os.chdir(folder_name)
            download_folder(drive, folder_id)
        else:
            request = drive.files().export(fileId=file_id, mimeType='text/plain')
            download_chunks(request, file_name + ".tex", True)
    except:
        print("Drive API Error!")
        sys.exit()
    return

def compile_tex():
    global client_secret, file_id, file_name, compile_enabled, folder_enabled
    try:
        subprocess.call("pdflatex --synctex=1 " + file_name.replace(" ", "\ ") + ".tex", shell=True)
    except:
        print("Compilation Error!")
        sys.exit()
    return

def main():
    global client_secret, file_id, file_name, compile_enabled, folder_enabled
    init()
    download()
    if compile_enabled:
        compile_tex()
    return

if __name__ == '__main__':
    main()

