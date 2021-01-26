from django.contrib.sitemaps import Sitemap
from .models import Movie, Seance


class MovieSitemap(Sitemap):
    changefreq = "weekly"

    def items(self):
        return Movie.objects.all()


class SeanceSitemap(Sitemap):
    changefreq = 'weekly'

    def items(self):
        return Seance.objects.all()
