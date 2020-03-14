from django.urls import path
from core import views


urlpatterns = [
    path('project', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('project/<uuid:alias>', views.ProjectDetailsView.as_view(), name='project-details'),
    path('project/export/<uuid:alias>', views.project_export_view, name="export-project"),
    path('project/import/<uuid:alias>', views.project_import_view, name="import-project"),

    path('todo', views.TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<uuid:alias>', views.TodoDetailsView.as_view(), name='todo-details'),

    path('todo/start/<uuid:alias>', views.TodoStart.as_view(), name='todo-start'),
    path('todo/stop/<uuid:alias>', views.TodoStop.as_view(), name='todo-stop'),
]
