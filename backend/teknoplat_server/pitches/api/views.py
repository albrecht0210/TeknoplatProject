import json

from rest_framework import permissions, status, viewsets
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response

from ..models import Pitch
from .serializers import PitchSerializer
from .external_services import validate_team, fetch_team

class PitchViewSet(viewsets.ModelViewSet):
    queryset = Pitch.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = PitchSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_queryset(self):
        queryset = self.queryset
        team_params = self.request.query_params.get('team', None)

        if team_params:
            queryset = queryset.filter(team=team_params)

        return queryset
    
    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     offset_param = self.request.query_params.get('offset')
    #     limit_param = self.request.query_params.get('limit')
        
    #     data = queryset
    #     if offset_param and limit_param:
    #         data = self.paginate_queryset(queryset)

    #     serializer = self.get_serializer(data, many=True)
    #     data_content = serializer.data
        
    #     return self.get_paginated_response(data_content) if (offset_param and limit_param) else Response(data_content, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        team_name = request.data.pop('team_name')

        team = validate_team(name=team_name, request=self.request)

        team_response = json.loads(team.content.decode('utf-8'))

        if team.status_code == 404:
            return Response(team_response, status=status.HTTP_404_NOT_FOUND)
        elif team.status_code == 500:
            return Response({'error': 'Team Management Server is down.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        request.data['team'] = team_response['id']

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AccountPitchAPIView(generics.ListCreateAPIView):
#     serializer_class = PitchSerializer
#     permission_classes = (permissions.IsAuthenticated, )

#     def get_queryset(self):
#         team_name_param = self.request.query_params.get('team_name', None)

#         if team_name_param:
#             team = fetch_team(name=team_name_param, request=self.request)

#             team_response = json.loads(team.content.decode('utf-8'))

#             if team.status_code == 404:
#                 return Response(team_response, status=status.HTTP_404_NOT_FOUND)
#             elif team.status_code == 500:
#                 return Response({'error': 'Team Management Server is down.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
#             try:
#                 queryset = Pitch.objects.filter(team=team_response['id'])
#                 if not queryset.exists():
#                     raise Pitch.DoesNotExist
#                 return queryset
#             except Pitch.DoesNotExist:
#                 return Response({'error', 'Pitch does not exists.'}, status=status.HTTP_404_NOT_FOUND)
#         return Response({'error', 'Add parameter team.'}, status=status.HTTP_400_BAD_REQUEST)