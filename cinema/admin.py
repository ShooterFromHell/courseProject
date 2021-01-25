from django.contrib import admin

from .models import Comment, Movie, Seance, Ticket

admin.site.register(Comment)
admin.site.register(Movie)
admin.site.register(Seance)
admin.site.register(Ticket)
