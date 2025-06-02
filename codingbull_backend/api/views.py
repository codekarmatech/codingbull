from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
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
        queryset = super().get_queryset().order_by('-published_date')
        category_id = self.request.GET.get('category_id', None)
        category_name = self.request.GET.get('category', None)
        
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

@api_view(['GET'])
def technologies_list(request):
    """
    Get all available technologies
    Returns the same technology data that's used in the TechStack component
    """
    technologies = [
        # Frontend
        {'id': 1, 'name': 'HTML5', 'slug': 'html5', 'category': 'frontend', 'color': '#E34F26'},
        {'id': 2, 'name': 'CSS3', 'slug': 'css3', 'category': 'frontend', 'color': '#1572B6'},
        {'id': 3, 'name': 'JavaScript', 'slug': 'javascript', 'category': 'frontend', 'color': '#F7DF1E'},
        {'id': 4, 'name': 'TypeScript', 'slug': 'typescript', 'category': 'frontend', 'color': '#3178C6'},
        {'id': 5, 'name': 'React', 'slug': 'react', 'category': 'frontend', 'color': '#61DAFB'},
        {'id': 6, 'name': 'Redux Toolkit', 'slug': 'redux-toolkit', 'category': 'frontend', 'color': '#764ABC'},
        {'id': 7, 'name': 'Tailwind CSS', 'slug': 'tailwind-css', 'category': 'frontend', 'color': '#06B6D4'},

        # Backend
        {'id': 8, 'name': 'Python', 'slug': 'python', 'category': 'backend', 'color': '#3776AB'},
        {'id': 9, 'name': 'Django', 'slug': 'django', 'category': 'backend', 'color': '#092E20'},
        {'id': 10, 'name': 'Flask', 'slug': 'flask', 'category': 'backend', 'color': '#000000'},
        {'id': 11, 'name': 'Node.js', 'slug': 'nodejs', 'category': 'backend', 'color': '#339933'},
        {'id': 12, 'name': 'Express', 'slug': 'express', 'category': 'backend', 'color': '#000000'},

        # Database
        {'id': 13, 'name': 'MongoDB', 'slug': 'mongodb', 'category': 'database', 'color': '#47A248'},
        {'id': 14, 'name': 'PostgreSQL', 'slug': 'postgresql', 'category': 'database', 'color': '#336791'},
        {'id': 15, 'name': 'Redis', 'slug': 'redis', 'category': 'database', 'color': '#DC382D'},

        # DevOps
        {'id': 16, 'name': 'Docker', 'slug': 'docker', 'category': 'devops', 'color': '#2496ED'},
        {'id': 17, 'name': 'GitHub Actions', 'slug': 'github-actions', 'category': 'devops', 'color': '#2088FF'},
        {'id': 18, 'name': 'AWS', 'slug': 'aws', 'category': 'devops', 'color': '#FF9900'},
        {'id': 19, 'name': 'Azure', 'slug': 'azure', 'category': 'devops', 'color': '#0078D4'},

        # 3D & Visualization
        {'id': 20, 'name': 'Three.js', 'slug': 'threejs', 'category': '3d', 'color': '#000000'},
        {'id': 21, 'name': 'WebGL', 'slug': 'webgl', 'category': '3d', 'color': '#990000'},
        {'id': 22, 'name': 'React Three Fiber', 'slug': 'react-three-fiber', 'category': '3d', 'color': '#61DAFB'},

        # Additional common technologies
        {'id': 23, 'name': 'Chart.js', 'slug': 'chartjs', 'category': 'frontend', 'color': '#FF6384'},
        {'id': 24, 'name': 'Redux', 'slug': 'redux', 'category': 'frontend', 'color': '#764ABC'},
    ]
    
    return Response({
        'results': technologies,
        'count': len(technologies)
    })
