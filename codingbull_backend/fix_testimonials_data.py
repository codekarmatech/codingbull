#!/usr/bin/env python3
"""
Script to fix testimonial data with correct author names and titles
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
django.setup()

from api.models import Project, Testimonial

def fix_testimonials_data():
    """Fix testimonial data with correct information"""
    
    print("Fixing testimonials data...")
    
    # Correct testimonial data based on the frontend mock data
    testimonial_fixes = {
        'Gujju-Masla E-commerce Platform': {
            'author': 'Deep Varma',
            'title': 'Managing Director',
            'company': 'Gujju-Masla'
        },
        'Physioway Enterprise Physiotherapy System': {
            'author': 'Dr. Rajavi Dixit',
            'title': 'Founder & CEO',
            'company': 'Physioway'
        },
        'Harsh Patel Attendance Management Dashboard': {
            'author': 'Harsh Patel',
            'title': 'CEO',
            'company': 'Harsh Patel Enterprises'
        }
    }
    
    for project_title, correct_data in testimonial_fixes.items():
        try:
            project = Project.objects.get(title=project_title)
            testimonial = Testimonial.objects.get(project=project)
            
            print(f"\nUpdating testimonial for {project_title}:")
            print(f"  Before: {testimonial.author} - {testimonial.title} - {testimonial.company}")
            
            # Update testimonial
            testimonial.author = correct_data['author']
            testimonial.title = correct_data['title']
            testimonial.company = correct_data['company']
            testimonial.save()
            
            # Also update the project fields to keep them in sync
            project.testimonial_author = correct_data['author']
            project.author_title = correct_data['title']
            project.author_company = correct_data['company']
            project.save()
            
            print(f"  After:  {testimonial.author} - {testimonial.title} - {testimonial.company}")
            
        except Project.DoesNotExist:
            print(f"Project '{project_title}' not found")
        except Testimonial.DoesNotExist:
            print(f"Testimonial for project '{project_title}' not found")
    
    print(f"\nFinal testimonials:")
    for testimonial in Testimonial.objects.all():
        project_title = testimonial.project.title if testimonial.project else "No project"
        print(f"  - {testimonial.author} ({testimonial.title}) at {testimonial.company}")
        print(f"    Project: {project_title}")
        print(f"    Quote: {testimonial.quote[:80]}...")
        print()

if __name__ == '__main__':
    fix_testimonials_data()