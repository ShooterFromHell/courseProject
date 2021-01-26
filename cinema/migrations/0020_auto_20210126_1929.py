# Generated by Django 3.1.3 on 2021-01-26 17:29

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('cinema', '0019_auto_20210123_1251'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ticket',
            options={'verbose_name': 'Билет', 'verbose_name_plural': 'Билеты'},
        ),
        migrations.RemoveField(
            model_name='seance',
            name='hall',
        ),
        migrations.AlterField(
            model_name='seance',
            name='end',
            field=models.DateTimeField(default=datetime.datetime(2021, 1, 26, 17, 29, 42, 324736, tzinfo=utc), verbose_name='конец сеанса'),
        ),
    ]
