# Generated by Django 5.0.4 on 2024-07-07 14:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_user_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='com_date',
            field=models.CharField(default=datetime.datetime(2024, 7, 7, 22, 38, 28, 861056), max_length=100),
        ),
        migrations.AlterField(
            model_name='user',
            name='user_indate',
            field=models.CharField(default=datetime.datetime(2024, 7, 7, 22, 38, 28, 860058), max_length=100),
        ),
    ]