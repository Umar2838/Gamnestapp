# Generated by Django 5.1.1 on 2024-11-14 07:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0017_totalpurchasedtickets'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchasedtickets',
            name='purchase_date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='totalpurchasedtickets',
            name='purchase_date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]