# Generated by Django 2.1.2 on 2019-11-21 00:09

from django.db import migrations, models
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Calcuation',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('calulationString', models.CharField(max_length=1000)),
            ],
        ),
    ]
