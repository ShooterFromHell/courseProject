from django.db import models
from django.db.models import ImageField
from django.urls import reverse
from django.utils import timezone


class Movie(models.Model):
    poster = ImageField('постер', upload_to='images/', null=True, blank=True)
    movie_title = models.CharField('название фильма', max_length=100, null=False)
    movie_title_eng = models.CharField('название фильма англ', max_length=100, null=False)
    genre = models.CharField('жанр', max_length=100, null=False)
    duration = models.CharField('продолжительность', max_length=50, null=False)
    premiere = models.DateField('премьера', default=timezone.now, null=False)
    end_of_distribution = models.DateField('конечная дата проката', default=timezone.now, null=False)
    country = models.CharField('страна производства', max_length=100, null=False)
    director = models.CharField('режиссер', max_length=100, null=False)
    cast = models.CharField('актеры', max_length=250, null=False)
    plot = models.TextField('краткое описание', null=False)

    def get_absolute_url(self):
        return reverse("film", kwargs={"movie_id": self.id})

    class Meta:
        verbose_name = 'Фильм'
        verbose_name_plural = 'Фильмы'


class Comment(models.Model):
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE, related_name='comments', null=False)
    author_name = models.CharField(verbose_name="имя автора", max_length=50, null=False)
    comment_text = models.TextField(verbose_name="текст комментария", max_length=500, null=False)
    created = models.DateTimeField(default=timezone.now, null=False)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ('created',)
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return 'Comment by {} on {}'.format(self.author_name, self.movie)


class Seance(models.Model):
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE, related_name='seance', null=False)
    start = models.DateTimeField(verbose_name="начало сеанса", default=timezone.now, null=False)
    end = models.DateTimeField(verbose_name="конец сеанса", default=timezone.now(), null=False)

    class Meta:
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'


class Ticket(models.Model):
    seance = models.ForeignKey(Seance, verbose_name="сеанс", on_delete=models.CASCADE, null=False)
    row = models.CharField(verbose_name="ряд", max_length=3, null=False)
    seat = models.CharField(verbose_name="место", max_length=3, null=False)

    class Meta:
        verbose_name = 'Билет'
        verbose_name_plural = 'Билеты'
