from django.urls import path
from django.conf.urls import url
from django.conf.urls.static import static
from glatex_app.views import *
from . import views

app_name = 'glatex_app'

urlpatterns = [
    path('', views.index, name='index'),
    path('alive', views.alive, name='alive'),
    path('<str:file_id>/<str:file_name>/view', views.view, name='view'),
    path('privacy_policy', views.privacy_policy, name='privacy_policy'),
    path('terms_of_service', views.terms_of_service, name='terms_of_service'),
    path('<str:file_id>/<str:file_name>/tex/<str:pos>', views.tex, name='tex'),
    path('<str:file_id>/<str:file_name>/pdf/<str:lineNumber>', views.pdf, name='pdf'),
    path('<str:file_id>/<str:file_name>/compile', views.compile, name="compile"),
    path('<str:file_id>/<str:file_name>/download', views.download, name="download"),
    url('gitpull', views.git_pull, name='gitpull'),
]+static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
