from rest_framework.decorators import api_view
from rest_framework.response import Response
from .db import collection

@api_view(['POST'])
def submit_contact(request):
    collection.insert_one({
        "name": request.data.get("name"),
        "email": request.data.get("email"),
        "subject": request.data.get("subject"),
        "message": request.data.get("message"),
    })

    return Response({"msg": "saved bro 🔥"})