# Generated by Django 5.0.4 on 2024-07-05 07:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_remove_teacher_department_remove_teacher_teacher_id_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usebook',
            unique_together={('course', 'teacher', 'course', 'school_year', 'semester')},
        ),
    ]
