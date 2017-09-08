show_buttons = function(){
    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/js/bootstrap.min.js", function(){console.log('bootstrap loaded');});
    jQuery('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" type="text/css" />');

    var btn=document.createElement("BUTTON");
    var t=document.createTextNode("show offer");
    btn.setAttribute('style','color: blue; vertical-align: top; color: blue; position: fixed; top: 15%; right: 0; opacity: .2; width: 120px; z-index: 1000; text-align: center; font-size: 12px;');
    btn.setAttribute('onClick','jQuery("#myModal").modal("show")');
    btn.appendChild(t);
    document.body.appendChild(btn);
    
    var btn=document.createElement("BUTTON");
    var t=document.createTextNode("update profile");
    btn.setAttribute('style','color: blue; vertical-align: top; color: blue; position: fixed; top: 25%; right: 0; opacity: .2; width: 120px; z-index: 1000; text-align: center; font-size: 12px;');
    btn.setAttribute('id', 'btn_post');
    btn.appendChild(t);
    document.body.appendChild(btn);
    
    var modal = `<div id="myModal" class="modal fade" role="dialog">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Interact Offer</h4>
              </div>
              <div class="modal-body">
                <img id="interact_image" />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>`;

    jQuery("body").append(modal);
};


var sdk = { 
    session_id: '123',
    interact_instance: 'interact.ibmxone.com:7001',
    audience: 'Individual',
    audience_key: 'Indiv_Id',
    audience_value: '1',
    audience_type: 'numeric', 
    interactive_channel: '',
    rely_on_existing_session: false,
    param_type: null,
    param_value: null,
    param_key: null,
    use_ssl: false,
    get start_session_json(){ 
        return `{
            "sessionId": "` + this.session_id + `",
            "commands": [
                {
                    "audienceLevel": "` + this.audience + `",
                    "debug": true,
                    "action": "startSession",
                    "ic": "` + this.interactive_channel + `",
                    "relyOnExistingSession": ` + this.rely_on_existing_session + `,
                    "audienceID": [
                        {
                        "t": "` + this.audience_type + `",
                        "v": ` + this.audience_value + `,
                        "n": "` + this.audience_key + `"
                        }
                    ],
                    "parameters": [
                        {
                        "t": "` + this.param_type + `",
                        "v": "` + this.param_value + `",
                        "n": "` + this.param_key + `"
                        }
                    ]
                }
            ]
        }`;
    },
    number_of_offers: 1,
    offer_attribute: "OfferURL",
    interaction_point: "default",
    get get_offers_json(){
        return `{
            "sessionId": "` + this.session_id + `",
            "commands": [
                {
                "numberRequested": ` + this.number_of_offers + `,
                "action": "getOffers",
                "ip": "` + this.interaction_point + `"
                }
            ]
        }`;
    },
    event: "updateProfile",
    event_type: "string",
    event_value: "u100",
    event_key: "Response",
    get post_event_json(){
        return `{
            "sessionId": "` + this.session_id + `",
            "commands": [
                {
                "action": "postEvent",
                "event": "` + this.event + `",
                "parameters": [
                    {
                    "t": "` + this.event_type + `",
                    "v": "` + this.event_value + `",
                    "n": "` + this.event_key + `"
                    }
                ]
                }
            ]
        }`;
    },
    get get_profile_json(){
        return `{
            "sessionId": "` + this.session_id + `",
            "commands": [
                {
                "action": "getProfile"
                }
            ]
        }`;
    },
    get end_session_json(){
        return `{
            "sessionId": "` + this.session_id + `",
            "commands": [
                {
                "action": "endSession"
                }
            ]
        }`;
    },
    fire_post: function(json) {
        var ssl = '';
        if(this.use_ssl){ ssl = 's'; }
        var req = jQuery.ajax({
          url: 'http' + ssl + '://' + this.interact_instance + '/interact/servlet/RestServlet',
          type: 'post',
          contentType: 'application/json; charset=utf-8',
          data: json
        });
      return req;
    }  
};

var url = {
    getParameterByName: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

var json = {
    getJSONObjects: function(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(this.getJSONObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }
}


var logger = function(type,_json,data){
    console.log("sent " + type + " json:");
    console.log(JSON.parse(_json));
    console.log("received:");
    console.log(data);
};

console.log('interact SDK loaded');