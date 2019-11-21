from djongo import models

# Create your models here.
class Calculation(models.Model):
    first = models.CharField(max_length=1000)
    second = models.CharField(max_length=1000)
    operator = models.CharField(max_length=1)
    result = models.CharField(max_length=1000)
    _id = models.ObjectIdField()
    timeCreated = models.DateTimeField(auto_now=True)