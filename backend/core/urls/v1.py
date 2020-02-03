from django.urls import path
from core import views


urlpatterns = [
    path('project', views.ProjectListCreateView.as_view(), name='project-list-create'),
    path('project/<uuid:alias>', views.ProjectDetailsView.as_view(), name='project-details'),

    path('todo', views.TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<uuid:alias>', views.TodoDetailsView.as_view(), name='todo-details'),
]
