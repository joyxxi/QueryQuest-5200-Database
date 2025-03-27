from django.db import models
from submissions.models import Submission

class Feedback(models.Model):
    """
    Model to store student feedback on problems.
    A student can provide multiple feedback entries for the same problem.
    Feedback  corresponds to the unique submission in Submissions model.
    """
    feedback_id = models.AutoField(primary_key=True)
    submission = models.OneToOneField(Submission, on_delete=models.CASCADE)
    f_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.feedback_id} for Submission {self.submission.submission_id}"
    
    class Meta:
        db_table = 'Feedback'