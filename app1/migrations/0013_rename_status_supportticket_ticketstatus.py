# Generated by Django 5.1.1 on 2024-10-28 07:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0012_supportticket_priority_supportticket_reply_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='supportticket',
            old_name='status',
            new_name='ticketstatus',
        ),
    ]