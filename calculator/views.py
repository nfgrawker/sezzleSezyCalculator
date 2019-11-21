import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .models import Calculation

# Create your views here.


def calculator(request):
    context = {}
    return render(request, "calculator/index.html", context)


def calculate(request):
    if request.method == "GET":
        calcs = Calculation.objects.filter().order_by("timeCreated")
        print(calcs)
        calcsReversed = calcs.reverse()
        response = {"status": "1", "message": ("OK")}
        idx = 0
        for calc in calcsReversed:
            if idx > 9:
                calc.delete()
            response[idx] = {"first":calc.first,"second":calc.second,"operator":calc.operator,"result":calc.result}
            idx +=1
        print(response)
        return HttpResponse(json.dumps(response), content_type="application/json")
    elif request.method == "POST":
        jsonIncoming = json.loads(request.body.decode("utf8"))
        print(jsonIncoming)
        calculation = Calculation(result=jsonIncoming["result"], first=jsonIncoming["first"],second=jsonIncoming["second"],operator=jsonIncoming["operator"])
        calculation.save()
        response = {"status": "1", "message": ("OK"), "type":"post"}
        return HttpResponse(json.dumps(response), content_type="application/json")
