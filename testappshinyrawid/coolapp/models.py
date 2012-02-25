from django.db import models

class AnotherCoolModel(models.Model):
    name = models.CharField(max_length=200)

class CoolModel(models.Model):
    name = models.CharField(max_length=200)
    m2m = models.ManyToManyField(AnotherCoolModel)
