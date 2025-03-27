from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User, Student
from problems.models import Problem
from progress.models import Progress

class ProgressAPITests(APITestCase):

    def setUp(self):
        # Create users (student, instructor, admin)
        self.student_user = User.objects.create_user(
            username='student1', email='student1@example.com', password='password123', role='student')
        self.instructor_user = User.objects.create_user(
            username='instructor1', email='instructor1@example.com', password='password123', role='instructor')
        self.admin_user = User.objects.create_user(
            username='admin1', email='admin1@example.com', password='password123', role='admin')
        
        # Create student profiles linked to the user
        self.student = Student.objects.create(student_id=self.student_user, current_level=1, total_points=100)
        
        # Create problems
        self.problem1 = Problem.objects.create(problem_id=1, title='SQL Problem 1')
        self.problem2 = Problem.objects.create(problem_id=2, title='SQL Problem 2')

        # Create progress entries
        self.progress1 = Progress.objects.create(student=self.student, problem=self.problem1, status='Incomplete')
        self.progress2 = Progress.objects.create(student=self.student, problem=self.problem2, status='Incomplete')

        # URLs for API endpoints
        self.progress_url = reverse('progress-detail', args=[self.student.user_id, self.problem1.problem_id])
        self.create_student_url = reverse('create-student-with-progress')
        self.create_problem_url = reverse('create-problem-with-progress')

    def test_create_student_with_progress(self):
        data = {
            'username': 'student2',
            'email': 'student2@example.com',
            'password': 'password123',
            'role': 'student',
        }

        response = self.client.post(self.create_student_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)

    def test_create_problem_with_progress(self):
        data = {
            'problem_id': 3,
            'title': 'SQL Problem 3',
        }

        response = self.client.post(self.create_problem_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)

    def test_get_progress(self):
        response = self.client.get(self.progress_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Incomplete')

    def test_create_progress_when_exists(self):
        data = {
            'student': self.student.user_id,
            'problem': self.problem1.problem_id,
            'status': 'Incomplete',
        }

        # Try to create a progress for an existing student/problem pair
        response = self.client.post(self.progress_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Progress already exists for this student and problem.')

    def test_update_progress(self):
        data = {
            'status': 'Completed',
            'complete_at': '2025-03-26T12:00:00Z'
        }

        # Update the progress for the student/problem pair
        response = self.client.patch(self.progress_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'Completed')

    def test_update_progress_not_found(self):
        # Try updating a non-existing progress record
        invalid_url = reverse('progress-detail', args=[999, 999])
        data = {
            'status': 'Completed',
        }

        response = self.client.patch(invalid_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Progress not found for this student and problem.')

    def test_create_student_with_progress_invalid_role(self):
        data = {
            'username': 'student_invalid',
            'email': 'student_invalid@example.com',
            'password': 'password123',
            'role': 'teacher',  # Invalid role
        }

        response = self.client.post(self.create_student_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)
