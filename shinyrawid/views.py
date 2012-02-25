import json
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from django.db.models import get_model
from django.template import RequestContext, loader

def ajax_draw_box(request):
    """ draw the boxes for the models, shown in the admin under the raw_id field
        Only admin stuff users are allowed to use this view.
        Can return more then one box at a time
        """

    if not request.user.is_staff:
        raise PermissionDenied

    app_name = request.GET.get('app')
    model_name = request.GET.get('model')

    model = get_model(app_name, model_name)

    result = {}
    for id in request.GET.getlist('id'):
        try:
            object = model.objects.get(pk=id)
            t = loader.select_template((
                              'shinyrawid/%s/%s.html' % (app_name, model_name),
                              'shinyrawid/%s.html' % (model_name),
                              'shinyrawid/default_box.html',
                          ))
            c = RequestContext(request, {'object': object})
        except model.DoesNotExist:
            t = loader.get_template('shinyrawid/notfound.html')
            c = RequestContext(request)

        result[id] = t.render(c)

    return HttpResponse(json.dumps(result), mimetype='application/json')
