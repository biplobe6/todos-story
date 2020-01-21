from django.db import models


class Meta(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Project(Meta):
    title = models.TextField()
    description = models.TextField(default="", blank=True)
    assets_dir = models.CharField(max_length=300)

    def __str__(self):
        return "#{} {}".format(self.id, self.title)


class Todo(Meta):
    title = models.TextField()
    story = models.TextField(default="", blank=True)
    done = models.BooleanField(default=False, blank=True)
    position = models.IntegerField(null=True, blank=True)
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return "#{} {}".format(self.id, self.title)

