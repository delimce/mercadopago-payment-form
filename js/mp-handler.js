

var MP_key = 'TEST-91cf50c6-bc90-4fbf-8003-b914c164d729' ///sandbox

function addEvent(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function () {
            handler.call(el);
        });
    }
};



function MPinit() {

    Mercadopago.setPublishableKey(MP_key);
    var idTypes = Mercadopago.getIdentificationTypes();

}


function getBin() {
    var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
    return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
};


function guessingPaymentMethod(event) {
    var bin = getBin();

    if (event.type == "keyup") {
        if (bin.length >= 6) {
            Mercadopago.getPaymentMethod({
                "bin": bin
            }, setPaymentMethodInfo);
        }
    } else {
        setTimeout(function () {
            if (bin.length >= 6) {
                Mercadopago.getPaymentMethod({
                    "bin": bin
                }, setPaymentMethodInfo);
            }
        }, 100);
    }
};





function setPaymentMethodInfo(status, response) {
    if (status == 200) {


        // do somethings ex: show logo of the payment method
        var form = document.querySelector('#pay');

        if (document.querySelector("input[name=paymentMethodId]") == null) {
            var paymentMethod = document.createElement('input');
            paymentMethod.setAttribute('name', "paymentMethodId");
            paymentMethod.setAttribute('type', "hidden");
            paymentMethod.setAttribute('value', response[0].id);

            form.appendChild(paymentMethod);

            console.log(paymentMethod)

        } else {
            document.querySelector("input[name=paymentMethodId]").value = response[0].id;
        }
    }
};






function doPay(event) {
    event.preventDefault();
    if (!doSubmit) {
        

        Mercadopago.clearSession(); ///mega important!!!

        Mercadopago.setPublishableKey(MP_key);

        var $form = document.querySelector('#pay');
        
        Mercadopago.createToken($form, sdkResponseHandler); // The function "sdkResponseHandler" is defined below

        return false;
    }
};




function sdkResponseHandler(status, response) {

   var result = {}

    if (status != 200 && status != 201) {
        var error_data = response;
        last = error_data.cause.length-1;
        var message = errorHandler(error_data.cause[last].code)
        alert("verify filled data: " + message);

        result.success = false;
        result.error = message;

    } else {

        result.success = true;
        result.token = response.id;


     //   doSubmit = true;


        //  form.submit();
    }

    console.log(result);
};




function errorHandler(code) {

    var message = '';
    switch (code) {
        case "205":
            message = "Error, el número de la TDC no puede estar vácio"
            break;

        case "208":
            message = "Error, mes de expiración no puede estar vácio"
            break;


        case "209":
            message = "Error, año de expiración no puede estar vácio"
            break;

        case "214":
            message = "Error, documento de identidad inválido"
            break;


        case "221":
            message = "Error, el nombre del tarjetahabiente no puede ser vácio"
            break;


        case "325":
            message = "Error, mes de expiración inválido"
            break;

        case "326":
            message = "Error, año de expiración inválido"
            break;


        case "E301":
            message = "Error, año de expiración inválido"
            break;

        case "E302":
            message = "Error, código de seguridad inválido"
            break;

        default:
            message = "Error en datos de la TDC"
            break;

    }

    return message;

}

