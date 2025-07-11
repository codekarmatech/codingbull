# Generated by Django 5.2.1 on 2025-06-11 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_service_detailed_features_alter_service_features'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_id', models.CharField(db_index=True, max_length=100, unique=True)),
                ('user_id', models.CharField(blank=True, max_length=100, null=True)),
                ('start_time', models.DateTimeField(auto_now_add=True)),
                ('last_activity', models.DateTimeField(auto_now=True)),
                ('duration', models.PositiveIntegerField(default=0)),
                ('user_agent', models.TextField()),
                ('browser_info', models.JSONField(blank=True, default=dict)),
                ('page_views', models.PositiveIntegerField(default=0)),
                ('errors_encountered', models.PositiveIntegerField(default=0)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('country', models.CharField(blank=True, max_length=100, null=True)),
                ('city', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'ordering': ['-start_time'],
            },
        ),
        migrations.CreateModel(
            name='ErrorLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('error_type', models.CharField(choices=[('javascript', 'JavaScript Error'), ('api', 'API Error'), ('network', 'Network Error'), ('render', 'Render Error'), ('performance', 'Performance Issue')], db_index=True, max_length=20)),
                ('severity', models.CharField(choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('critical', 'Critical')], db_index=True, default='medium', max_length=10)),
                ('message', models.TextField()),
                ('stack_trace', models.TextField(blank=True, null=True)),
                ('component_stack', models.TextField(blank=True, null=True)),
                ('url', models.URLField(max_length=500)),
                ('user_agent', models.TextField()),
                ('browser_info', models.JSONField(blank=True, default=dict)),
                ('user_id', models.CharField(blank=True, max_length=100, null=True)),
                ('session_id', models.CharField(blank=True, max_length=100, null=True)),
                ('page_load_time', models.PositiveIntegerField(blank=True, null=True)),
                ('memory_usage', models.PositiveIntegerField(blank=True, null=True)),
                ('breadcrumbs', models.JSONField(blank=True, default=list)),
                ('extra_data', models.JSONField(blank=True, default=dict)),
                ('count', models.PositiveIntegerField(default=1)),
                ('first_seen', models.DateTimeField(auto_now_add=True)),
                ('last_seen', models.DateTimeField(auto_now=True)),
                ('is_resolved', models.BooleanField(default=False)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('resolved_by', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'ordering': ['-timestamp'],
                'indexes': [models.Index(fields=['error_type', 'severity'], name='api_errorlo_error_t_95dffc_idx'), models.Index(fields=['url', 'timestamp'], name='api_errorlo_url_48dcc8_idx'), models.Index(fields=['is_resolved', 'severity'], name='api_errorlo_is_reso_080cba_idx')],
            },
        ),
        migrations.CreateModel(
            name='PerformanceLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('metric_type', models.CharField(choices=[('page_load', 'Page Load'), ('api_call', 'API Call'), ('component_render', 'Component Render'), ('user_interaction', 'User Interaction')], db_index=True, max_length=20)),
                ('duration', models.PositiveIntegerField()),
                ('url', models.URLField(max_length=500)),
                ('user_agent', models.TextField()),
                ('user_id', models.CharField(blank=True, max_length=100, null=True)),
                ('session_id', models.CharField(blank=True, max_length=100, null=True)),
                ('metrics', models.JSONField(blank=True, default=dict)),
            ],
            options={
                'ordering': ['-timestamp'],
                'indexes': [models.Index(fields=['metric_type', 'timestamp'], name='api_perform_metric__22051d_idx'), models.Index(fields=['url', 'timestamp'], name='api_perform_url_e7c7f5_idx')],
            },
        ),
    ]
