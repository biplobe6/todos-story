from django.db import models
from uuid import uuid4


class Meta(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Project(Meta):
    alias = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.TextField()
    description = models.TextField(default="", blank=True)
    assets_dir = models.CharField(max_length=300)

    def __str__(self):
        return "#{} {}".format(self.alias, self.title)


class Todo(Meta):
    alias = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    rq = models.IntegerField(blank=True)
    title = models.TextField()
    story = models.TextField(default="", blank=True)
    done = models.BooleanField(default=False, blank=True)
    position = models.FloatField()
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
        return "#{} {}".format(self.alias, self.title)


    def next_rq(self):
        last_todo = Todo.objects.filter(
            project=self.project
        ).order_by(
            'rq'
        ).values(
            'rq'
        ).last()
        return 1 if last_todo is None else last_todo['rq'] + 1


    def save(self, *args, **kwargs):
        if self.rq is None:
            self.rq = self.next_rq()
        super().save(*args, **kwargs)


