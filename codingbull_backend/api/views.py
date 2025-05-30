from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, BlogPost, Project, Service, ContactInquiry, Testimonial
from .serializers import CategorySerializer, BlogPostSerializer, ProjectSerializer, ServiceSerializer, ContactInquirySerializer, TestimonialSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get']  # Only allow read operations
    
    @action(detail=False, methods=['get'])
    def with_post_count(self, request):
        """
        Get all categories with post count
        """
        categories = Category.objects.all()
        result = []
        
        for category in categories:
            post_count = BlogPost.objects.filter(category=category).count()
            category_data = self.get_serializer(category).data
            category_data['post_count'] = post_count
            result.append(category_data)
            
        return Response(result)

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'category__name']
    ordering_fields = ['published_date']
    ordering = ['-published_date']
    http_method_names = ['get']  # Only allow read operations
    lookup_field = 'slug'  # Use slug for detail view lookups
    
    def get_queryset(self):
        """
        Optionally filter by category
        """
        queryset = BlogPost.objects.all().order_by('-published_date')
        category_id = self.request.query_params.get('category_id', None)
        category_name = self.request.query_params.get('category', None)
        
        if category_id and category_id.isdigit():
            queryset = queryset.filter(category_id=category_id)
        elif category_name and category_name.lower() != 'all':
            queryset = queryset.filter(category__name__iexact=category_name)
            
        return queryset
        
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Get posts filtered by category
        """
        category_name = request.query_params.get('category', None)
        if not category_name or category_name.lower() == 'all':
            queryset = self.get_queryset()
        else:
            queryset = BlogPost.objects.filter(category__name__iexact=category_name).order_by('-published_date')
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured blog posts
        """
        # Get the 3 most recent posts as featured
        queryset = BlogPost.objects.all().order_by('-published_date')[:3]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    http_method_names = ['get']  # Only allow read operations

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'slug'
    http_method_names = ['get']  # Only allow read operations

class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    http_method_names = ['post']  # Only allow create operations

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'status': 'success', 'message': 'Inquiry submitted successfully'},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    http_method_names = ['get']  # Only allow read operations
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to return a consistent response format
        that matches what the frontend expects
        """
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
