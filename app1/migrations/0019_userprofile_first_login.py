# Generated by Django 5.1.1 on 2024-11-18 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0018_alter_purchasedtickets_purchase_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='first_login',
            field=models.BooleanField(default=True),
        ),
    ]
