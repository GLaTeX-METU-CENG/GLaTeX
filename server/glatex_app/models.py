from django.db import models

class Pdf(models.Model):
	file_id = models.CharField(max_length=100)

