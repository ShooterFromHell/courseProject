# Generated by Django 3.1.3 on 2020-12-29 11:18

import datetime
from django.db import migrations, models
from django.utils.timezone import utc
import embed_video.fields


class Migration(migrations.Migration):

    dependencies = [
        ('cinema', '0015_auto_20201219_1511'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='video',
            field=embed_video.fields.EmbedVideoField(blank=True, verbose_name='Видео'),
        ),
        migrations.AlterField(
            model_name='comment',
            name='comment_text',
            field=models.TextField(max_length=500, verbose_name='текст комментария'),
        ),
        migrations.AlterField(
            model_name='seance',
            name='end',
            field=models.DateTimeField(default=datetime.datetime(2020, 12, 29, 11, 18, 3, 65483, tzinfo=utc), verbose_name='конец сеанса'),
        ),
    ]
