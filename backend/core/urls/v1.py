from django.urls import path
from core import views


urlpatterns = [
    path('project', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('project/<uuid:alias>', views.ProjectDetailsView.as_view(), name='project-details'),
    path('project/export/<uuid:alias>', views.export_project, name="export-project"),
    path('project/import/<uuid:alias>', views.import_project, name="import-project"),

    path('todo', views.TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<uuid:alias>', views.TodoDetailsView.as_view(), name='todo-details'),
]
