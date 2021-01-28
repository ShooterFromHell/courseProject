from django.urls import path
from . import views

urlpatterns = [
    path('', views.distribution, name='index'),
    path('<int:movie_id>/', views.film, name='film'),
    path('announcement/', views.announcement, name='announcement'),
    path('distribution/', views.distribution, name='distribution'),
    path('order/<int:seance_id>/', views.order, name='order'),
]
