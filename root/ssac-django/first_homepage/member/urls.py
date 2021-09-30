from django.urls import path
from . import views

urlpatterns = [
  path('letsgetit', views.hello),
  path('send', views.send),
  path('receive', views.rec),
  path('select', views.sel),
  path('page/<str:someday>/<str:whatstory>/', views.page),
  path('static_ex', views.static),
  path('join', views.join, name='join'),
  path('joined', views.joined, name='joined'),
  path('login', views.login, name='login'),
  path('logged', views.logged, name='logged'),
  path('pw_upate', views.pw_update, name='pw_update'),
  path('pw_complete', views.pw_complete, name='pw_complete'),
  path('member_del', views.member_del, name='member_del'),
  path('mem_del_complete', views.mem_del_complete, name='mem_del_complete'),
  path('check_logged', views.check_logged, name='check_logged'),
  path('logout', views.logout, name='logout'),
  path('callback', views.callback),
  path('ajax', views.ajax),
  path('upload', views.upload_file),
  path('uploadToFile', views.uploadToFile),
  path('checkBox', views.checkBox),
  path('checkReturn', views.checkReturn)
]
