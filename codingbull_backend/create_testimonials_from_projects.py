#!/usr/bin/env python3
"""
Script to create Testimonial objects from existing Project testimonial data
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
django.setup()

from api.models import Project, Testimonial

def create_testimonials_from_projects():
    """Create Testimonial objects from Project testimonial fields"""
    
    print("Creating testimonials from project data...")
    
    # Get all projects with testimonial data
    projects_with_testimonials = Project.objects.filter(
        testimonial_quote__isnull=False,
        testimonial_author__isnull=False
    ).exclude(
        testimonial_quote='',
        testimonial_author=''
    )
    
    print(f"Found {projects_with_testimonials.count()} projects with testimonial data")
    
    created_count = 0
    updated_count = 0
    
    for project in projects_with_testimonials:
        print(f"\nProcessing project: {project.title}")
        
        # Check if testimonial already exists for this project
        existing_testimonial = Testimonial.objects.filter(project=project).first()
        
        if existing_testimonial:
            # Update existing testimonial
            existing_testimonial.quote = project.testimonial_quote
            existing_testimonial.author = project.testimonial_author
            existing_testimonial.title = project.author_title or ''
            existing_testimonial.company = project.author_company or project.client_name
            existing_testimonial.save()
            updated_count += 1
            print(f"  Updated existing testimonial for {project.title}")
        else:
            # Create new testimonial
            testimonial = Testimonial.objects.create(
                quote=project.testimonial_quote,
                author=project.testimonial_author,
                title=project.author_title or '',
                company=project.author_company or project.client_name,
                project=project
            )
            created_count += 1
            print(f"  Created new testimonial for {project.title}")
            print(f"    Author: {testimonial.author}")
            print(f"    Company: {testimonial.company}")
    
    print(f"\nSummary:")
    print(f"  Created: {created_count} testimonials")
    print(f"  Updated: {updated_count} testimonials")
    print(f"  Total testimonials in database: {Testimonial.objects.count()}")
    
    # Display all testimonials
    print(f"\nAll testimonials:")
    for testimonial in Testimonial.objects.all():
        project_title = testimonial.project.title if testimonial.project else "No project"
        print(f"  - {testimonial.author} ({testimonial.company}) - Project: {project_title}")

if __name__ == '__main__':
    create_testimonials_from_projects()