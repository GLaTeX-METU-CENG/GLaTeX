from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from glatex_app.views import *
import glatex_app.urls

urlpatterns = [
    path('',include(glatex_app.urls)),
    path('admin/', admin.site.urls),
]
