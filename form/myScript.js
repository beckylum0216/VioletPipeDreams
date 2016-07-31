$(document).ready(function() {
    $('#water-form').formValidation({
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            soilType: {
                validators: {
                    callback: {
                        callback: function(value, validator, $field) {
                            return validate(value);
                        }
                    }
                }
            },
            catchment: {
                validators: {
                    callback: {
                        callback: function(value, validator, $field) {
                            return validate(value);
                        }
                    }
                }
            },
            proximity: {
                validators: {
                    callback: {
                        callback: function(value, validator, $field) {
                            return validate(value);
                        }
                    }
                }
            }

        }
    });
});

validate = function(value) {
    var msg = "";
    var isValid = false;
    switch (value) {
        case "Clay" :
        case "Sand" :
        case "P1" :
        case "P2" :
        case "proximity_yes":
            msg = "Waste water not in a viable alternative";
            isValid = false;
            break;
        case "Salt" :
        case "P3":
        case "proximity_no":
            msg = "Waste water a viable alternative";
            break;

    }
    return {
        message: msg,
        valid: isValid
    };
};