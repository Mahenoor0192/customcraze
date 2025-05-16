from django.urls import path
from .views import OrderStatusView

urlpatterns = [
    path('order-status/', OrderStatusView.as_view(), name='order-status'),
]
