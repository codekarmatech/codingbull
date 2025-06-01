from django.core.management.base import BaseCommand
from api.models import Project
import json


class Command(BaseCommand):
    help = 'Populate the database with sample project data'

    def handle(self, *args, **options):
        # Clear existing projects (optional)
        if self.confirm_action("Do you want to clear existing projects?"):
            Project.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Cleared existing projects.'))

        # Sample projects data matching frontend expectations
        projects_data = [
            {
                'title': 'Gujju-Masla E-commerce Platform',
                'client_name': 'Gujju-Masla',
                'category': 'E-commerce',
                'description': 'A modern e-commerce platform for a 40-year-old spice brand, enabling online ordering and expanding their customer base.',
                'challenge': 'Gujju-Masla needed to modernize its 40-year-old brand with an online ordering system to reach new customers.',
                'solution': 'Built on Django, React, Tailwind CSS, and Docker for rapid, reliable deployments.',
                'outcome': 'Launched in 4 weeks; online orders rose by 30% within the first month.',
                'tech_used': ['React', 'Django', 'Tailwind CSS', 'Docker', 'PostgreSQL'],
                'stats': ['30% increase in online orders', '4 weeks delivery time', '100% uptime'],
                'testimonial_quote': 'Hiring CodingBull was a game-changer for our business. The team delivered our e-commerce platform in just 4 weeks, leading to a 30% surge in online orders.',
                'testimonial_author': 'Rajesh Patel',
                'author_title': 'CEO',
                'author_company': 'Gujju-Masla',
            },
            {
                'title': 'Physioway Enterprise Physiotherapy System',
                'client_name': 'Physioway',
                'category': 'Healthcare',
                'description': 'A secure, enterprise-grade application for managing patient assessments and treatment plans across multiple physiotherapy clinics.',
                'challenge': 'Physioway required a secure, enterprise-grade application to manage patient assessments and treatment plans across multiple clinics.',
                'solution': 'Developed with Django REST Framework, React, and integrated audit logs for HIPAA-style compliance.',
                'outcome': 'Deployed in 8 weeks; clinic efficiency improved by 40%, and patient satisfaction scores rose 15%.',
                'tech_used': ['Django', 'React', 'PostgreSQL', 'Docker', 'Redux'],
                'stats': ['40% efficiency improvement', '15% satisfaction increase', '8 weeks delivery'],
                'testimonial_quote': 'The enterprise physiotherapy system built by CodingBull transformed our workflow. Their React/Django solution is robust, user-friendly, and fully compliant.',
                'testimonial_author': 'Dr. Rajavi Dixit',
                'author_title': 'Founder & CEO',
                'author_company': 'Physioway',
            },
            {
                'title': 'Harsh Patel Attendance Management Dashboard',
                'client_name': 'Harsh Patel Enterprises',
                'category': 'Enterprise',
                'description': 'A real-time attendance tracking and analytics dashboard for distributed teams, saving hours of manual reporting.',
                'challenge': 'Harsh Patel Enterprises needed real-time attendance tracking and analytics for their distributed teams.',
                'solution': 'Built a custom dashboard using Flask, MongoDB, and Chart.js for live reporting, containerized with Docker.',
                'outcome': 'Saved over 20 hours of manual reporting per month and slashed errors by 90%.',
                'tech_used': ['Flask', 'MongoDB', 'Chart.js', 'Docker', 'Python'],
                'stats': ['20+ hours saved monthly', '90% error reduction', 'Real-time analytics'],
                'testimonial_quote': 'Our custom attendance management dashboard exceeded expectations. Real-time analytics and reporting have saved us countless hours every month.',
                'testimonial_author': 'Harsh Patel',
                'author_title': 'CEO',
                'author_company': 'Harsh Patel Enterprises',
            }
        ]

        # Create projects
        created_count = 0
        for project_data in projects_data:
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                defaults=project_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created project: {project.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Project already exists: {project.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} new projects.')
        )

    def confirm_action(self, message):
        """Ask user for confirmation"""
        response = input(f"{message} (y/N): ")
        return response.lower() in ['y', 'yes']