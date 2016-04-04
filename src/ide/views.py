from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden
import requests

RUN_URL = "https://api.hackerearth.com/v3/code/run/"
def index(request):
	return render(request, 'index.html', {})

#From HackerEarth API
def runCode(request):
	if request.is_ajax():
		source = request.POST['source']
		lang = request.POST['lang']
		data = {
			'client_secret': 'efee14e3d19da585f2660381d79d81891f3417a9' ,
			'async': 0,
			'source': source,
			'lang': lang,
			'time_limit': 5,
			'memory_limit': 262144,
		}
		if 'input' in request.POST:
			data['input'] = request.POST['input']
		r = requests.post(RUN_URL, data=data)
		return JsonResponse(r.json(), safe=False)

	else:
		return HttpResponseForbidden()