from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProblemViewSet, get_all_with_progress, get_units

router = DefaultRouter()
router.register(r'', ProblemViewSet, basename='problem')

urlpatterns = [
    # This will generate routes like:
    # GET    /api/problems/           -> list all problems
    # POST   /api/problems/           -> create a problem
    # GET    /api/problems/{pk}/      -> retrieve a problem by id
    # PUT    /api/problems/{pk}/      -> update a problem
    # DELETE /api/problems/{pk}/      -> delete a problem
    # GET    /api/problems/unit/<unit_id>/ -> custom action for problems in a single unit
    path('', include(router.urls)),
    path('all_with_progress/<int:student_id>', get_all_with_progress, name='problems_with_progress'),
    path('units', get_units, name='get_units')
]
