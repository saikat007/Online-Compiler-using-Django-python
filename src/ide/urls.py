from django.conf.urls import url

from . import views

app_name = 'ide'
urlpatterns = [

	url(r'^$', views.index, name='index'),
	url(r'^run/$', views.runCode, name='run'),

]
