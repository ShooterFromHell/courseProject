from django import forms
from snowpenguin.django.recaptcha3.fields import ReCaptchaField
from .models import Comment


class CommentForm(forms.ModelForm):
    captcha = ReCaptchaField()

    class Meta:
        model = Comment
        fields = ('author_name', 'comment_text', 'captcha')
