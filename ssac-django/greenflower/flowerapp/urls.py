from os import name
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.home, name='home'),
    path('signup', views.signup, name='signup'),
    path('idCk', views.idCk, name='idCk'),
    path('pwCk', views.pwCk, name='pwCk'),
    path('signCom', views.sign_com, name='sign_com'),
    path('login', views.login, name='login'),
    path('logged', views.logged, name='logged'),
    path('logout', views.logout, name='logout'),
    path('pwChange', views.pwChange, name='pwChange'),
    path('pwComplete', views.pwComplete, name='pwComplete'),
    path('withdrawal', views.withdrawal, name='withdrawal'),
    path('withdrawalUser', views.withdrawalUser, name='withdrawalUser'),
    path('mypage', views.mypage, name='mypage'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
