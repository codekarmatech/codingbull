from rest_framework import serializers
from .models import Category, BlogPost, Project, Service, ContactInquiry, Testimonial


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BlogPostSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'author', 'published_date', 'category', 'image', 'image_url', 'tags']

class TestimonialSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_id = serializers.IntegerField(source='project.id', read_only=True)
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        """
        Return the appropriate logo image for the testimonial
        Priority: testimonial.image -> project.client_logo -> None
        """
        request = self.context.get('request')
        
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        elif obj.project and obj.project.client_logo:
            if request:
                return request.build_absolute_uri(obj.project.client_logo.url)
            return obj.project.client_logo.url
        
        return None
    
    class Meta:
        model = Testimonial
        fields = [
            'id',
            'quote', 
            'author', 
            'title', 
            'company', 
            'image',
            'project_id',
            'project_title'
        ]

class ProjectSerializer(serializers.ModelSerializer):
    testimonials = TestimonialSerializer(many=True, read_only=True)
    # Map field names to match frontend expectations
    client = serializers.CharField(source='client_name', read_only=True)
    image = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    technologies = serializers.JSONField(source='tech_used', read_only=True)
    
    def get_image(self, obj):
        if obj.project_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.project_image.url)
            return obj.project_image.url
        return None
    
    def get_logo(self, obj):
        if obj.client_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.client_logo.url)
            return obj.client_logo.url
        return None
    
    # Create testimonial object from individual fields
    testimonial = serializers.SerializerMethodField()
    
    def get_testimonial(self, obj):
        if obj.testimonial_quote and obj.testimonial_author:
            return {
                'quote': obj.testimonial_quote,
                'author': obj.testimonial_author,
                'title': obj.author_title,
                'company': obj.author_company,
                'image': None  # No image field in the current model
            }
        return None
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'client_name', 'client', 'category', 'description', 
            'challenge', 'solution', 'outcome', 'tech_used', 'technologies', 'stats',
            'client_logo', 'logo', 'project_image', 'image', 'testimonial_quote', 
            'testimonial_author', 'author_title', 'author_company', 'testimonial',
            'testimonials'
        ]

class ServiceSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    def get_image(self, obj):
        if obj.icon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.icon.url)
            return obj.icon.url
        return None
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'slug', 'summary', 'description', 'icon', 'image']

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'inquiry_type', 'created_at']


