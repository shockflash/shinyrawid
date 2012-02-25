if (jQuery === undefined) {
    jQuery = django.jQuery;
}


function dismissRelatedLookupPopup(win, chosenId) {
    var name = windowname_to_id(win.name);
    var elem = document.getElementById(name);
    if (elem.className.indexOf('vManyToManyRawIdAdminField') != -1 && elem.value) {
        elem.value += ',' + chosenId;
    } else {
        document.getElementById(name).value = chosenId;
    }
    win.close();

    jQuery(document.getElementById(name)).change();
}

function ShinyRawIdField(input) {

    this.input = input;
    this.atag = jQuery('#lookup_' + this.input.attr('id'))
    this.list = jQuery('<div class="shinyrawid_list">Loading...</div>');

    this.data = {};

    this.app = '';
    this.model = '';

    this.init = function() {
        this.extractAppModel(this.atag.attr('href'));

        this.atag.parent().append(this.list);

        this.reload();

        /* event listener */

        var self = this;
        this.input.change(function() {
            self.reload();
        });
    }

    this.extractAppModel = function(url) {
        var parts = url.split('/');

        this.app = parts[parts.length-3];
        this.model = parts[parts.length-2];
    }

    this.getIds = function() {

        var ids = this.input.val().split(',');

        if (ids.length == 1 && ids[0] == '')
            ids = []

        return ids;
    }


    this.reload = function() {
        var ids = this.getIds();

        var loadIds = [];

        for (var i = 0; i <= ids.length-1; i++) {
            var id = ids[i];

            if (id == '')
                continue;

            if (!this.data[id])
                loadIds.push(id);
        }

        if (loadIds.length > 0)
            this.load(ids);
        else
            this.draw();
    }

    this.remove = function(id) {
        var ids = this.getIds();

        var currentPos = ids.indexOf(id);

        // remove from the current pos
        ids.splice(currentPos, 1);

        this.input.val(ids.join(','));
        this.draw();
    }

    this.moveUp = function(id) {
        var ids = this.getIds();

        var currentPos = ids.indexOf(id);

        // remove from the current pos
        ids.splice(currentPos, 1);

        // insert it into the new pos. Splice can also insert elements
        ids.splice(currentPos-1, 0, id);

        this.input.val(ids.join(','));
        this.draw();
    }

    this.moveDown = function(id) {
        var ids = this.getIds();

        var currentPos = ids.indexOf(id);

        // remove from the current pos
        ids.splice(currentPos, 1);

        // insert it into the new pos. Splice can also insert elements
        ids.splice(currentPos+1, 0, id);

        this.input.val(ids.join(','));
        this.draw();
    }

    this.draw = function() {
        var ids = this.getIds();

        this.list.html('');

        var self = this;

        // no entries, no list
        if (ids.length == 0)
            return;


        for (var i = 0; i <= ids.length-1; i++) {
            var id = ids[i];

            var row = jQuery('<div class="row"></div>');

            var up = jQuery('<span class="up">Up</span>');
            up.data('id', id);
            var down = jQuery('<span class="down">Down</span>');
            down.data('id', id);
            var remove = jQuery('<span class="remove">Remove</span>');
            remove.data('id', id);

            var leftBox = jQuery('<div class="left"></div>');

            // not first
            if (i > 0) {
                leftBox.append(up);
            }

            leftBox.append(remove);

            // not last
            if (i < ids.length-1 ) {
                leftBox.append(down);
            } else {
                row.addClass('last');
            }

            // only one entry? no need for a last line
            if (ids.length == 1)
                row.addClass('last');

            var rightBox = jQuery('<div class="right"></div>');
            rightBox.append(this.data[id]);

            row.append(leftBox, rightBox, '<br style="clear: left">');

            this.list.append(row);
        }

        jQuery('.up', this.list).click(function() {
            self.moveUp(jQuery(this).data('id'));
        });

        jQuery('.down', this.list).click(function() {
            self.moveDown(jQuery(this).data('id'));
        });

        jQuery('.remove', this.list).click(function() {
            self.remove(jQuery(this).data('id'));
        });
    }

    this.load = function(ids) {
        var url = '/__shinyrawid/ajax_draw_box?app=' + this.app + '&model=' + this.model;
        for (var i = 0; i <= ids.length-1; i++)
            url = url + '&id=' + ids[i];

        var self = this;
        jQuery.get(url, function(data) {
            for (id in data)
                self.data[id] = data[id];
            self.draw();
        })
    }

    this.init();
}


(function ($) {

    $(document).ready(function() {
        $('.vManyToManyRawIdAdminField').each(function() {
            new ShinyRawIdField(jQuery(this));
        });
    });

})(jQuery);
