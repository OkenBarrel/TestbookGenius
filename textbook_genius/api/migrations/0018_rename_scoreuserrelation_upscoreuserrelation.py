# Generated by Django 5.0.4 on 2024-07-08 09:00

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_profile_alter_comment_user_id_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ScoreUserRelation',
            new_name='UpScoreUserRelation',
        ),
    ]
