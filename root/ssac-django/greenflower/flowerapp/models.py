from django.db import models

class FlowerUser(models.Model):
  userid = models.CharField(max_length=50, verbose_name='아이디')
  password = models.CharField(max_length=50, verbose_name='비밀번호')
  useremail = models.EmailField(max_length=254, verbose_name='이메일')
  useraddress = models.CharField(max_length=300, verbose_name='주소')
  registerTime = models.DateTimeField(auto_now_add=True, verbose_name='가입날짜')

  def __str__(self):
    return self.userid

class Items(models.Model):
  name = models.CharField(max_length=100, verbose_name='상품')

class Cart(models.Model):
  pass