from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import PaperSerializer,UserSerializer,MyTokenObtainPairSerializer
from .models import Users,Papers
from .recommender import DocumentSearch,InterestAmplifier
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenViewBase,TokenObtainPairView
from rest_framework_simplejwt.backends import TokenBackend
import PyPDF2 as pdf


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
class TokenRefreshView(TokenViewBase):
    def post(self, request):
        refresh_token=request.data["refresh"]
        if not refresh_token:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh=RefreshToken(refresh_token)
            valid_data = TokenBackend(algorithm='HS256').decode(refresh_token,verify=False)
            email = valid_data.get('user_id')
            user=Users.objects.all().filter(id=email).first()
            refresh1=RefreshToken.for_user(user)
            response=Response({
                "access":str(refresh1.access_token),
                "refresh":str(refresh1),
            })
            refresh.blacklist()
            return response
            
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST)
        

class RegisterView(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            refresh = RefreshToken.for_user(user)
            response= Response({
                "access": str(refresh.access_token),
                "refresh":str(refresh),
            })
            return response
        else :
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        

class LoginView(APIView):
    def post(self,request):
        email_username=request.data['email_username']
        password=request.data['password']
        if '@'in email_username:
            user=Users.objects.all().filter(email=email_username).first()
            if user==None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            elif user.check_password(raw_password=password):
                refresh=RefreshToken.for_user(user)
                response= Response({
                    "access": str(refresh.access_token),
                    "refresh":str(refresh),
                })
                return response
        else:
            user=Users.objects.all().filter(username=email_username).first()
            if user==None:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            elif user.check_password(raw_password=password):
                refresh=RefreshToken.for_user(user)
                response= Response({
                    "access": str(refresh.access_token),
                    "refresh":str(refresh),
                })
                return response


            
class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        auth_header = request.headers.get('Authorization')
        token = None

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        user = getUser(token=token) 
        if request.data["query"]=="recommendation":
            doc = DocumentSearch()
            paper_list = doc.search(query_terms=user.interests)
            serializer = PaperSerializer(paper_list, many=True)
            response = Response(serializer.data, status=status.HTTP_200_OK)
            response["Interests"] = user.interests
            return response
        else:
            ia = InterestAmplifier(user=user, text=request.data["query"])
            ia.from_search()
            doc = DocumentSearch()
            paper_list = doc.search(query_terms=request.data["query"])
            serializer = PaperSerializer(paper_list, many=True)
            response = Response(serializer.data, status=status.HTTP_200_OK)
            response["Interests"] = user.interests 
            return response
    
class PaperView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        auth_header = request.headers.get('Authorization')
        token=None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        user=getUser(token=token)

        paper=Papers.objects.all().filter(id=request.data['id']).first()
        ia=InterestAmplifier(user=user,text=paper.title+" "+paper.abstract)
        ia.from_paper()
        serializer=PaperSerializer(paper)
        if paper:
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response({
                "detail":"Paper not found"
            },status=status.HTTP_404_NOT_FOUND)

class PdfView(APIView):
    permission_classes=[IsAuthenticated]
    def post (self,request):
        auth_header = request.headers.get('Authorization')
        token=None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        user=getUser(token=token)
        pdf_file=request.FILES['pdf']
        try:
            pdf_reader = pdf.PdfReader(pdf_file)
            if len(pdf_reader.pages) > 0:  # Ensure there is at least one page
                first_page = pdf_reader.pages[0]
                query = first_page.extract_text()
                ia=InterestAmplifier(text=query,user=user)
                ia.from_pdf()
                if not query:
                    query = "Title not found in text"
            if query=="Title not found in text":
                return Response({
                    "error":"Metadata does not contain sufficient information"
                },status=status.HTTP_400_BAD_REQUEST)
            else:
                doc=DocumentSearch()
                paper_list=doc.search(query_terms=query)
                serializer=PaperSerializer(paper_list,many=True)
                return Response(serializer.data,status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error":str(e)
            },status=status.HTTP_400_BAD_REQUEST)

    
class LogoutView(APIView):
    def post(self, request):

        refresh_token = request.data["refresh"]

        if not refresh_token:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist() 
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        finally:
            response = Response(status=status.HTTP_200_OK)
            return response


def getUser(token):
    valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
    user_id= valid_data.get('user_id')
    return Users.objects.all().filter(id=user_id).first()