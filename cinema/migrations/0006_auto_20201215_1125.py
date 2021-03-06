# Generated by Django 3.1.3 on 2020-12-15 09:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cinema', '0005_auto_20201207_1703'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='cinema',
        ),
        migrations.AddField(
            model_name='comment',
            name='movie',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='cinema.movie'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='comment',
            name='comment_text',
            field=models.TextField(max_length=500, verbose_name='текст комментария'),
        ),
    ]
