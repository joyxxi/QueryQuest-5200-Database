# Generated by Django 5.1.7 on 2025-04-10 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Progress',
            fields=[
                ('progress_id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('Incomplete', 'Incomplete'), ('Complete', 'Complete')], default='Incomplete', max_length=10)),
                ('complete_at', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Progress',
                'managed': False,
            },
        ),
    ]
