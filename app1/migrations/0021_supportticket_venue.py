# Generated by Django 5.1.3 on 2025-02-25 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0020_purchasedtickets_credits'),
    ]

    operations = [
        migrations.AddField(
            model_name='supportticket',
            name='venue',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
