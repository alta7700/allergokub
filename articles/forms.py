from django.forms import ModelForm, ValidationError
from .models import ArticleBlock


allowed_styles = [
    'font-size', 'font-weight', 'font-family', 'font-style',
    'align-self', 'text-align', 'color', 'line-height',
    'width', 'max-width', 'height', 'max-height',
    'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
    'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'border', 'border-top', 'border-bottom', 'border-left', 'border-right',
    'display',
]


class ArticleBlockAdminForm(ModelForm):

    class Meta:
        model = ArticleBlock
        fields = '__all__'

    def clean(self):
        cleaned_data = super(ArticleBlockAdminForm, self).clean()
        text_styles = cleaned_data.get('text_styles')
        if text_styles:
            if ';' in text_styles:
                self.add_error(
                    'text_styles',
                    ValidationError(f'Нашёл ";". Его не должно быть')
                )
                return
            stylesheet = []
            for style in text_styles.split('\n'):
                style = style.strip()
                while style != style.replace('  ', ' '):
                    style = style.replace('  ', ' ')
                try:
                    key, value = style.split(':')
                except ValueError:
                    error_text = f'В строке "{style}" нет двоеточия' if ':' not in style else f'Проверь строку "{style}"'
                    self.add_error(
                        'text_styles',
                        ValidationError(error_text)
                    )
                    return
                key, value = key.strip(), value.strip()
                if key not in allowed_styles:
                    self.add_error(
                        'text_styles',
                        ValidationError(f'{key} нет в списке доступных стилей')
                    )
                    return
                stylesheet.append(f'{key}: {value}')
            self.cleaned_data['text_styles'] = '\n'.join(stylesheet)
        return self.cleaned_data



