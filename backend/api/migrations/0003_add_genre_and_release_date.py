# Generated migration for model changes

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_movie_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='genre',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='movie',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.RenameField(
            model_name='show',
            old_name='date',
            new_name='show_date',
        ),
        migrations.RenameField(
            model_name='show',
            old_name='time',
            new_name='show_time',
        ),
        migrations.AlterUniqueTogether(
            name='show',
            unique_together={('movie', 'show_date', 'show_time')},
        ),
    ]
