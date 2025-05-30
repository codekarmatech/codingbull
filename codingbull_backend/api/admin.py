from django.contrib import admin
from .models import Category, BlogPost, Project, Service, ContactInquiry, Testimonial

# Register your models here.
admin.site.register(Category)
admin.site.register(BlogPost)
admin.site.register(Project)
admin.site.register(Service)
admin.site.register(ContactInquiry)
admin.site.register(Testimonial)
