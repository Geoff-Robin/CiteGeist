# Generated by Django 5.1.4 on 2025-01-04 06:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_papers'),
    ]

    operations = [
        migrations.AddField(
            model_name='papers',
            name='categories',
            field=models.CharField(default=''),
            preserve_default=False,
        ),
    ]
