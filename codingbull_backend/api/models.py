from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True)
    author = models.CharField(max_length=100)
    published_date = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='blog_posts')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    challenge = models.TextField()
    solution = models.TextField()
    outcome = models.TextField()
    tech_used = models.JSONField()
    stats = models.JSONField()
    client_logo = models.ImageField(upload_to='project_logos/', blank=True, null=True)
    project_image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    testimonial_quote = models.TextField(blank=True)
    testimonial_author = models.CharField(max_length=100, blank=True)
    author_title = models.CharField(max_length=100, blank=True)
    author_company = models.CharField(max_length=100, blank=True)
    def __str__(self):
        return self.title

class Service(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    icon = models.ImageField(upload_to='service_icons/', blank=True, null=True)

    def __str__(self):
        return self.name

class ContactInquiry(models.Model):
    INQUIRY_TYPE_CHOICES = [
        ('general', 'General Inquiry'),
        ('newsletter', 'Newsletter Subscription'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPE_CHOICES, default='general')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.email}"

class Testimonial(models.Model):
    quote = models.TextField()
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonials')

    def __str__(self):
        return f"{self.author} - {self.company}"
