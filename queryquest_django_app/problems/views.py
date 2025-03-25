from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Problem, Unit, Module
from .serializers import ProblemSerializer

class IsInstructorOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow instructors and admins
    to perform write operations (create, update, delete).
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role in ['admin', 'instructor'])

class ProblemViewSet(viewsets.ModelViewSet):
    """ A viewset that provides CRUD operations for Problem objects. """
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

    def get_permissions(self):
        """ Assign permissions based on the action. """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsInstructorOrAdmin()]
        return [permissions.IsAuthenticated()]
    
    def retrieve(self, request, pk=None):
        """ Retrieve a single problem. """
        problem = get_object_or_404(Problem, pk=pk)
        serializer = self.get_serializer(problem)
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        """ Create a new problem. """
        data = request.data
        unit_id = data.get('unit_id')
        module_id = data.get('module_id')
        # check if request is valid
        error = {}
        error.update(self.unit_exists(unit_id))
        error.update(self.module_exists(module_id))
        error.update(self.correct_answer_error(data.get('correct_answer')))
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def update(self, request, pk=None, *args, **kwargs):
        """ Update an existing problem. """
        data = request.data
        error = {}
        # check if unit exists
        if 'unit_id' in data:
            error.update(self.unit_exists(data.get('unit_id')))
        # check if module exists
        if 'module_id' in data:
            error.update(self.module_exists(data.get('module_id')))
        # check if correct_answer is a valid choice
        if 'correct_answer' in data:
            error.update(self.correct_answer_error(data.get('correct_answer')))
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, pk=pk, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='unit/(?P<unit_id>[^/.]+)')
    def get_problems_by_unit(self, request, unit_id=None):
        """ Get all problems for a specific unit. """
        try:
            unit = Unit.objects.get(unit_id=unit_id)
        except Unit.DoesNotExist:
            return Response(
                {'error': f'Unit {unit_id} not found'}, 
                status=status.HTTP_404_NOT_FOUND
                )
        problems = Problem.objects.filter(unit_id=unit_id)
        serializer = self.get_serializer(problems, many=True)
        return Response(serializer.data)
    
    ## ----------------- Helper Methods ----------------- ##
    
    def unit_exists_error(self, unit_id):
        """ Check if a unit exists, return error dictionary if unit not exists. """
        if not Unit.objects.filter(unit_id=unit_id).exists():
            return {'error': f'Module {unit_id} not found'}
        else:
            return None
    
    def module_exists_error(self, module_id):
        """ Check if a module exists, return error dictionary if module not exists. """
        if not Module.objects.filter(module_id=module_id).exists():
            return {'error': f'Module {module_id} not found'}
        else:
            return None
    
    def correct_answer_error(self, correct_answer):
        """ Check if correct_answer is a valid choice, return error dictionary if not. """
        if correct_answer not in [1, 2, 3]:
            return {'error': f'correct_answer must be 1, 2, or 3'}
        else:
            return None