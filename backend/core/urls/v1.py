from django.urls import path
from core import views


urlpatterns = [
    path('todo/', views.TodoListCreateView.as_view(), name='todo-list-create'),
    path('todo/<int:id>/', views.TodoDetailsView.as_view(), name='todo-details'),
]
