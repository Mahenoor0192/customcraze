from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializer import OrderSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order

@api_view(['GET', 'POST'])
def order_list(request):
    if request.method == 'GET':
        status_param = request.query_params.get('status')
        if status_param:
            orders = Order.objects.filter(status=status_param)
        else:
            orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Save the new order to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return the newly created order
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return any validation errors

@api_view(['GET', 'PUT', 'POST'])
def order_detail(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'POST':
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
