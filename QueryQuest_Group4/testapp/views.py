from django.shortcuts import render
from .models import TestTable

# Create your views here.
def testmysql(request):
    test = TestTable.objects.all()
    context = {
    'test_number': test[0].number,
    'test_name': test[0].name,
    }
    return render(request, 'test_home.html', context)
