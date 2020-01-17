from django.db import models


class Meta(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Todo(Meta):
    title = models.TextField()

    def __str__(self):
        return "#{} {}".format(self.id, self.title)

