from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from .models import FlowerUser
from django.contrib import messages

def home(req): # 메인으로 보여지는 페이지
  print(req.session.get('id')) # 서버에서 session 값 잘 받아오는지 확인
  if req.session.get('id'): # session 값('id')가 있을 경우
    return render(req, 'home.html', {'session':req.session.get('id')}) # 템플릿 언어로 home.html에 파라미터 값 전달
  else:
    return render(req, 'home.html') # session 값이 없을 경우 그냥 home.html 띄움

def signup(req): # 회원가입 정보 입력 페이지
  # print(req.session.get('id'))
  return render(req, 'signup.html')

def idCk(req):
  print(req.POST.get('id_'))
  id_ck = FlowerUser.objects.filter(userid=req.POST.get('id_'))
  if id_ck:
    return HttpResponse("중복된 아이디 입니다.")
  elif str(req.POST.get('id_')).strip() == "":
    return HttpResponse("아이디를 입력해주세요.")
  else:
    return HttpResponse("사용 가능한 아이디 입니다.")

def pwCk(req):
  if str(req.POST.get('pwd1')).strip() == "" or str(req.POST.get('pwd2')).strip() == "":
    return HttpResponse('비밀번호를 입력해주세요.')
  elif req.POST.get('pwd1') == req.POST.get('pwd2'):
    return HttpResponse('비밀번호가 일치 합니다.')
  else:
    return HttpResponse('비밀번호가 일치하지 않습니다.')

def sign_com(req): # 회원가입 후 동작하는 함수(함수만 동작)
  if req.method == "POST": # POST 로 넘어온 값이 있을 때, 실행
    userid = req.POST.get('id')
    pw = req.POST.get('pw')
    email = req.POST.get('email')
    address = str(req.POST.get('address')) + " " + str(req.POST.get('address_detail'))
    # data는 넘길 값
      # 변수에 하나라도 빈 값이 있다면 error에 값을 넣어 오류를 출력할 것
    if not (userid and pw and email and address):
        messages.info(req, '정보를 입력해주세요.')
        return redirect('signup')
    else :
        # Model을 객체로 불러와 POST로 넘어온 변수의 값 넣어주기
        user = FlowerUser(userid=userid, password=pw, useremail=email, useraddress=address)
        user.save()
        messages.info(req, '회원가입이 완료되었습니다.')
        return redirect('login')

def login(req): # 로그인 정보 입력 페이지
  print(req.session.get('id'))
  return render(req, 'login.html')

def logged(req): # 로그인 후 동작하는 함수(함수만 동작)
  try:
    logged_user = FlowerUser.objects.get(userid = req.POST.get('id'), password = req.POST.get('pw')) # 모델에서 id와 pw를 받아서 logged_user 라는 변수에 넣음
    if logged_user: # id와 pw의 값이 있다면
      print('로그인 되었습니다.')
      print(logged_user)
      req.session['id'] = req.POST.get('id') # session 값을 id로 함
      print(req.session.get('id')) # 서버에서 session 값 잘 받아오는지 확인
      return redirect('home') # home으로 이동
  except FlowerUser.DoesNotExist: # 아무런 값이 없을 경우 예외처리
    print('로그인 실패')
    messages.info(req, '아이디와 패스워드를 확인해주세요.')
    return redirect('login')

def logout(req): # 로그아웃 시 동작하는 함수(함수만 동작)
  print(req.session.get('id')) # 서버에서 session 값 잘 받아오는지 확인
  try:
    req.session.pop('id')
    messages.info(req, '로그아웃 되었습니다.')
    return redirect('home') # session 값을 삭제하고 로그아웃 처리함
  except KeyError: # KeyError가 발생할 경우 예외처리
    messages.info(req, '정상적인 접근이 아닙니다. 홈화면으로 이동하세요.')
    return redirect('home') # session 값(키 값)이 없는데 있다고 우기는 경우(새로고침할 때) -> alert 처리

def pwChange(req):
  print(req.session.get('id'))
  return render(req, 'pwChange.html')

def pwComplete(req):
  print(req.session.get('id'))
  try:
    changeUser = FlowerUser.objects.get(userid=req.POST.get('id'), password=req.POST.get('pw'))
    print(changeUser)
    if changeUser:
      changeUser.password = req.POST.get('new_pw')
      changeUser.save()
      print('비밀번호 변경 완료')
      messages.info(req, '비밀번호 변경이 완료되었습니다.')
      return redirect('home')
  except FlowerUser.DoesNotExist:
    print('비번 변경 실패')
    messages.info(req, '정보를 정확히 입력해주세요.')
    return redirect('pwChange')

def withdrawal(req):
  print(req.session.get('id'))
  return render(req, 'withdrawal.html')

def withdrawalUser(req):
  print(req.session.get('id'))
  try:  
    delUser = FlowerUser.objects.get(userid=req.POST.get('id'), password=req.POST.get('pw'))
    if delUser:
      delUser.delete()
      req.session.pop('id')
      print('회원 탈퇴 완료')
      messages.info(req, '다시 만나요... ㅠㅠ')
      return redirect('home')
  except FlowerUser.DoesNotExist:
    print('회원 탈퇴 실패')
    messages.info(req, '정보를 정확히 입력해주세요.')
    return redirect('withdrawal')

def mypage(req):
  if req.session.get('id'): # session 값('id')가 있을 경우
    infoUser = FlowerUser.objects.get(userid=req.session.get('id'))
    return render(req, 'mypage.html', {'mypage':req.session.get('id'), 'infoUser':infoUser})
  else:
    messages.info(req, '로그인을 먼저 해주세요.')
    return redirect('home') # session 값이 없을 경우 그냥 home.html 띄움