from django.contrib import admin
from django.conf import settings

from models import CoolModel, AnotherCoolModel

STATIC_URL = getattr(settings, 'STATIC_URL', settings.MEDIA_URL)

class CoolModelAdmin(admin.ModelAdmin):

    raw_id_fields = ('m2m',)

    class Media:
        css = {
            "all": (STATIC_URL + 'shinyrawid/widget.css',)
        }
        js = (STATIC_URL + 'shinyrawid/widget.js',)

class AnotherCoolModelAdmin(admin.ModelAdmin):
    pass

admin.site.register(AnotherCoolModel, AnotherCoolModelAdmin)
admin.site.register(CoolModel, CoolModelAdmin)
