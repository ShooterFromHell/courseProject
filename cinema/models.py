from django.db import models
from django.db.models import ImageField
from django.urls import reverse
from django.utils import timezone
from embed_video.fields import EmbedVideoField


class Movie(models.Model):
    poster = ImageField('постер', upload_to='images/', null=True, blank=True)
    movie_title = models.CharField('название фильма', max_length=100)
    movie_title_eng = models.CharField('название фильма англ', max_length=100)
    genre = models.CharField('жанр', max_length=100)
    duration = models.CharField('продолжительность', max_length=50)
    premiere = models.DateField('премьера', default=timezone.now)
    end_of_distribution = models.DateField('конечная дата проката', default=timezone.now)
    country = models.CharField('страна производства', max_length=100)
    director = models.CharField('режиссер', max_length=100)
    cast = models.CharField('актеры', max_length=250)
    plot = models.TextField('краткое описание')
#    video = EmbedVideoField(blank=True, verbose_name='Видео')

    def get_absolute_url(self):
        return reverse("film", kwargs={"movie_id": self.id})

    class Meta:
        verbose_name = 'Фильм'
        verbose_name_plural = 'Фильмы'


class Comment(models.Model):
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(verbose_name="имя автора", max_length=50)
    comment_text = models.TextField(verbose_name="текст комментария", max_length=500)
    created = models.DateTimeField(default=timezone.now)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return 'Comment by {} on {}'.format(self.author_name, self.movie)


class Seance(models.Model):
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE, related_name='seance')
    start = models.DateTimeField(verbose_name="начало сеанса", default=timezone.now)
    end = models.DateTimeField(verbose_name="конец сеанса", default=timezone.now())
    hall = models.IntegerField(verbose_name="номер зала")

    class Meta:
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'

# class Ticket(models.Model):
#     seance = models.ForeignKey(Seance, verbose_name="сеанс", on_delete=models.CASCADE)
#     row = models.IntegerField(verbose_name="ряд")
#     seat = models.IntegerField(verbose_name="место")
