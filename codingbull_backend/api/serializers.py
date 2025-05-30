from rest_framework import serializers
from .models import Category, BlogPost, Project, Service, ContactInquiry, Testimonial


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BlogPostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'author', 'published_date', 'category', 'image', 'tags']

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'quote', 
            'author', 
            'title', 
            'company', 
            'image'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    testimonials = TestimonialSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'client_name', 'category', 'description', 
            'challenge', 'solution', 'outcome', 'tech_used', 'stats',
            'client_logo', 'project_image', 'testimonial_quote', 
            'testimonial_author', 'author_title', 'author_company',
            'testimonials'
        ]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = '__all__'


