from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.conf.urls.static import static


urlpatterns = [
    # Examples:
    #url(r'^$', 'newsletter.views.home', name='home'),
    url(r'^ide/', include('ide.urls')),
    url(r'^admin/', include(admin.site.urls)),
]

if settings.DEBUG:
	urlpatterns+= static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
	urlpatterns+= static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)