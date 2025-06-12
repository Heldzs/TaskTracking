from django.db import models
from django.contrib.auth.models import User


class TaskList(models.Model):
    id = models.BigAutoField(db_column="id", null=False, primary_key=True)
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        db_column="id_user",
    )
    title = models.CharField(db_column="ds_title", max_length=200, null=False)
    priority = models.IntegerField(db_column="nr_priority", null=False, default=0)
    created_at = models.DateTimeField(
        db_column="dt_created", auto_now_add=True, null=True
    )
    due_date = models.DateTimeField(db_column="dt_modified", auto_now=True, null=True)
    done = models.BooleanField(db_column="is_done", null=False, default=False)

    def __str__(self):
        return self.title


class Task(models.Model):
    id = models.BigAutoField(db_column="id", null=False, primary_key=True)
    task_list = models.ForeignKey(
        TaskList,
        on_delete=models.CASCADE,
        db_column="id_task_list",
    )
    content = models.TextField(db_column="ds_content", null=False)
    priority = models.IntegerField(db_column="nr_priority", null=False, default=0)
    created_at = models.DateTimeField(
        db_column="dt_created", auto_now_add=True, null=True
    )
    done = models.BooleanField(db_column="is_done", null=False, default=False)

    def __str__(self):
        return self.content[:100]


class Category(models.Model):
    id = models.BigAutoField(db_column="id", null=False, primary_key=True)
    name = models.CharField(db_column="ds_name", max_length=100, null=False)

    def __str__(self):
        return self.name
