from django.db import models
from users.models import User

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)  # Use message_id as PK
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    m_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.IntegerField(default=0)  # 0 for unread, 1 for read
    
    class Meta:
        db_table = 'Messages'
    
    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.m_content[:20]}..."