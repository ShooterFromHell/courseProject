# Generated by Django 3.1.3 on 2020-12-15 09:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cinema', '0006_auto_20201215_1125'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Cinema',
        ),
        migrations.AlterField(
            model_name='comment',
            name='movie',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cinema.movie', verbose_name='фильм'),
        ),
    ]
