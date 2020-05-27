from django import forms

class PostForm(forms.ModelForm):
    file_id = forms.CharField(max_length=50)
    image = forms.FileField()
