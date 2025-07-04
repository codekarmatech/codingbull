# Generated by Django 5.2.1 on 2025-06-02 21:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_service_faqs_service_features_service_icon_emoji_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='detailed_features',
            field=models.JSONField(blank=True, default=list, help_text='Detailed features with icon, title, description for service detail page'),
        ),
        migrations.AlterField(
            model_name='service',
            name='features',
            field=models.JSONField(blank=True, default=list, help_text='Simple list of feature strings for services listing page'),
        ),
    ]
