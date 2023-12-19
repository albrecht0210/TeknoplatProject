from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, AccountCourseListAPIView, AccountCourseRetrieveAPIView, CourseValidateAPIView

# Create a router for the CourseViewSet
router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    # Include the router's URL patterns
    path('', include(router.urls)),

    path('courses/<int:pk>/add_course_member/', CourseViewSet.as_view({'post': 'add_course_member'}), name='add-course-member'),
    
    path('account/profile/courses/', AccountCourseListAPIView.as_view(), name='courses-by-account'),
    path('account/profile/course/', AccountCourseRetrieveAPIView.as_view(), name='retrieve-course-by-account'),
    
    path('course/validate/', CourseValidateAPIView.as_view(), name='course-validate'),
]