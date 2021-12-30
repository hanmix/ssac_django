from django.shortcuts import redirect, render
from .models import User
import random
from django.core.exceptions import ObjectDoesNotExist
import os



def hello(req):
  c = random.randint(1, 101)

  return render(req, 'foryourcat.html', {'parameter1':c, 'parameter2':'하이'})

def send(req):
  return render(req, 'a.html')

def rec(req):
  return render(req, 'b.html', {
    'name': req.POST.get('name'), 
    'gender': req.POST.get('gender'), 
    'address': req.POST.get('address'), 
    'birth': req.POST.get('birth'), 
    'email': req.POST.get('email'), 
    'ID': req.POST.get('ID'), 
    'PW': req.POST.get('PW')
    })

def sel(req):
  return render(req, 'select.html')

def page(req, someday, whatstory):
  return render(req, 'pagelink.html', {'sd':someday, 'ws':whatstory})

def static(req):
    return render(req, 'static_ex.html')

# 회원가입
def join(req):
  return render(req, 'join.html')

# 회원가입 확인
def joined(req):
  join_member = User(userid=req.POST.get('id'), username=req.POST.get('name'), password=req.POST.get('pw'), gender=req.POST.get('gender'))
  join_member.save()
  print(req.POST.get('name'))
  print(req.POST.get('id'))
  print(req.POST.get('pw'))
  print(req.POST.get('gender'))
  return render(req, 'joined.html', {'userid':req.POST.get('id'), 'username':req.POST.get('name'), 'password':req.POST.get('pw'), 'gender':req.POST.get('gender')})

# 로그인
def login(req):
  return render(req, 'login.html')

# 로그인 확인
def logged(req):
  joined_member = User.objects.filter(userid=req.POST.get('id'), username=req.POST.get('name'), password=req.POST.get('pw'), gender=req.POST.get('gender'))
  if joined_member:
    print('로그인 되었습니다.')
    req.session['id'] = req.POST.get('id')
    return render(req, 'logged.html', {'total_member':joined_member, 'id':req.POST.get('id')})
  else:
    print('로그인이 실패하였습니다.')
    return render(req, 'login.html')

# 세션 확인
def check_logged(req):
  if req.session.get('id'):
    return render(req, 'logged.html', {'id':req.session.get('id')})
  else:
    return render(req, 'login.html', {'login':'로그인 먼저 해주세요!'})

# 로그아웃(세션 삭제)
def logout(req):
  try:
    req.session.pop('id')
    return render(req, 'login.html', {'logout':'로그아웃 되었습니다.'})
  except KeyError:
    return render(req, 'login.html', {'logout':'로그인 되었습니다.'})

# 비번변경
def pw_update(req):
  return render(req, 'pw_update.html')

# 비번변경 확인
def pw_complete(req):
  try:    
    user = User.objects.get(userid=req.POST.get('id'), password=req.POST.get('pw'))
    print(req.POST.get('id'))
    print(req.POST.get('pw'))
    if user:
      user.password = req.POST.get('new_pw')
      user.save()
      print('비번 변경 완료')
      return render(req, 'pw_complete.html')
  except ObjectDoesNotExist:
    print('비번 변경 실패')
    return redirect('pw_update')

# 회원 탈퇴
def member_del(req):
  return render(req, 'member_del.html')

# 회원 탈퇴 완료
def mem_del_complete(req):
  try:  
    del_user = User.objects.get(userid=req.POST.get('del_id'), password=req.POST.get('del_pw'))
    if del_user:
      del_user.delete()
      print('회원 탈퇴 완료')
      return render(req, 'mem_del_complete.html')
  except ObjectDoesNotExist:
    print('회원 탈퇴 실패')
    return redirect('member_del')

# callback 함수 연습
def callback(req):
    return render(req, 'callback.html')

def ajax(req):
    return render(req, 'k.html', {'parameter1':req.POST.get('id_'), 'parameter2':req.POST.get('pw_')}) # 각각의 parameter에 callback.html에서 보낸 id_와 pw_의 post값을 넣는다.

# from django.http import HttpResponseRedirect
# from .forms import UploadFileForm

# def upload_file(req):
#     if req.method == 'POST':
#         form = UploadFileForm(req.POST, req.FILES) #forms.py의 모델의 name과 file 값을 변수에 저장
#         if form.is_valid(): # 유효성 검사 (값이 제대로 들어왔는지)
#             handle_uploaded_file(req.FILES['file'])
#             return render(req, 'k.html') 
#             # 이동해서 표시할 html 파일
#             # return HttpResponseRedirect('/success/url/') # <- 경로를 작성
#     else:
#         form = UploadFileForm()
#         return render(req, 'upload.html', {'form': form})

# def handle_uploaded_file(f):
#     with open(os.path.abspath('./member/static/ssac.txt'), 'wb+') as destination: # wb+ : 새로 써라(write)
#       # as : ~로서 부른다
#         for chunk in f.chunks(): # chunk : 한 줄 한 줄 읽는다.
#             destination.write(chunk)

def upload_file(req):
  if req.method == 'POST':
    with open(os.path.abspath('./member/static/'+req.FILES['my_file'].name), 'wb+') as destination: # wb+ : 새로 써라(write)
    # as ~ : ~로서 부른다
      for chunk in req.FILES['my_file'].chunks(): # chunk : 한 줄 한 줄 읽는다.
          destination.write(chunk)
    return render(req, 'k.html') 
    # 이동해서 표시할 html 파일
    # return HttpResponseRedirect('/success/url/') # <- 경로를 작성
  else:
      return render(req, 'upload.html')


def uploadToFile(req):
  if req.method == "POST":
    with open(os.path.abspath('./member/static/'+req.FILES['my_file'].name), 'wb+') as destity:
      for chunk in req.FILES['my_file'].chunks():
        destity.write(chunk)
    return render(req, 'k.html')
  else:
    return render(req, 'uploadToFile.html')

def checkBox(req):
  return render(req, 'checkbox.html')

def checkReturn(req):
  return render(req, 'checkReturn.html', {'objects':req.POST.getlist('print_')})

