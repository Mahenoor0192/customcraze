from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from orders.models import Order
from .serializers import OrderSerializer

class OrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(name=request.user.username)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
