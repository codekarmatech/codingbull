# Blog Data Management

This directory contains mock data and utilities for the blog functionality, serving as a failsafe when the API is unavailable.

## Files

### `mockBlogData.js`
Contains comprehensive mock data for blog posts, categories, and related functionality. This serves as a fallback when the API is not available or returns errors.

## Fallback Strategy

The blog system implements a robust fallback strategy:

1. **Primary**: Attempt to fetch data from the API
2. **Fallback**: If API fails, use mock data from this directory
3. **Graceful Degradation**: Show appropriate loading states and error messages

## Configuration

The fallback behavior can be controlled via environment variables:

```env
# Enable/disable mock data fallback (default: true)
REACT_APP_ENABLE_MOCK_FALLBACK=true
```

## Mock Data Structure

### Blog Posts
Each blog post includes:
- `id`: Unique identifier
- `title`: Post title
- `slug`: URL-friendly identifier
- `excerpt`: Brief description
- `content`: Full HTML content
- `author`: Author name
- `published_date`: Publication date
- `category`: Category object with id, name, and slug
- `tags`: Array of tag objects
- `image_url`: Featured image URL
- `readingTime`: Estimated reading time
- `featured`: Boolean indicating if post is featured

### Categories
Each category includes:
- `id`: Unique identifier
- `name`: Display name
- `slug`: URL-friendly identifier
- `post_count`: Number of posts in category

## Usage

The mock data is automatically used by the API service when:
- The backend API is unavailable
- Network requests fail
- API returns unexpected responses

## Best Practices

1. **Keep Mock Data Updated**: Ensure mock data reflects the current API structure
2. **Realistic Content**: Use realistic content that matches production data
3. **Comprehensive Coverage**: Include edge cases and various content types
4. **Performance**: Mock data should be lightweight and fast to load

## Development

When developing new blog features:

1. Update mock data to include new fields
2. Test with both API and mock data
3. Ensure fallback behavior works correctly
4. Update this documentation as needed

## Production Considerations

- Mock data provides a safety net for production deployments
- Users will see content even if the API is temporarily unavailable
- Fallback behavior should be transparent to users
- Monitor API availability to minimize fallback usage