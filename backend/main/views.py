from django.shortcuts import render
from django.views.generic.base import RedirectView
from django.conf import settings


def index(request):
    return render(request, 'index.html')



favicon_view = RedirectView.as_view(
  url='{}favicon.ico'.format(settings.STATIC_URL),
  permanent=True,
)
