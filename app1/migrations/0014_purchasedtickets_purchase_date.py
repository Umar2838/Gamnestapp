# Generated by Django 5.1.1 on 2024-10-28 10:53

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0013_rename_status_supportticket_ticketstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchasedtickets',
            name='purchase_date',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]