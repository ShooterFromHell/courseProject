import datetime
from django.shortcuts import render
from django.urls import reverse
from django.http import Http404, HttpResponseRedirect
from .forms import CommentForm
from .models import Movie


def film(request, movie_id):
    try:
        a = Movie.objects.get(id=movie_id)
    except:
        raise Http404("Фильм не найден")
    comments = a.comments.filter(active=True)

    if request.method == 'POST':
        # A comment was posted
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
            # Create Comment object but don't save to database yet
            new_comments = comment_form.save(commit=False)
            # Assign the current post to the comment
            new_comments.movie = a
            # Save the comment to the database
            new_comments.save()
            return HttpResponseRedirect(reverse('film', args=(a.id,)))
    else:
        comment_form = CommentForm()
    return render(request, 'cinema/list.html',
                  {'movie': a,
                   'comments': comments,
                   'comment_form': comment_form})


def announcement(request):
    try:
        movies = Movie.objects.filter(premiere__gt=datetime.date.today())
    except:
        raise Http404("Анонсов нет(:")
    return render(request, 'cinema/announcement.html', {'announcement': movies})


def distribution(request):
    try:
        dist = Movie.objects.filter(end_of_distribution__gte=datetime.date.today())
        dist = dist.filter(premiere__lte=datetime.date.today())
    except:
        raise Http404("Нет фильмов в прокате(:")
    return render(request, 'cinema/distribution.html', {'distribution': dist})


def order(request):
    return render(request, 'cinema/order.html')
