# Generated by Django 5.1.4 on 2025-01-29 08:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_papers_categories'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='papers',
            name='categories',
        ),
    ]
