from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('',
    url(r'^ajax_draw_box$', 'shinyrawid.views.ajax_draw_box', name='shinyrawid__ajax_draw_box'),
)