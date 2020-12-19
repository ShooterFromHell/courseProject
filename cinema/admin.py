from django.contrib import admin

from .models import Comment, Movie, Seance

admin.site.register(Comment)
admin.site.register(Movie)
admin.site.register(Seance)

