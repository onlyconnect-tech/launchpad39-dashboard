/**
 * Client module.
 */

var clientAppModule = function () {

    function ClientApp(baseUrl) {
        
        this.BASE_SERVICE = baseUrl;
        this.isLogged = false;

        this.clientID = null;
        this.customerID = null;

        this.timerUpdateSession = null;
    }

    ClientApp.prototype.successLogin = function(data, status, xhr) {

        console.log(data);
        console.log(status);

        console.log(this);

        var self = this;

        if (data.statusCode == 200) {
            $('#modalLogin').modal('hide');

            this.clientID = data.clientID;
            this.customerID = data.customerID;

            function successUpdateSession(data, status, xhr) {
                console.log('SUCCESS UPDATE SESSION!!!');

            }

            function errorUpdateSession(jqXHR, textStatus, errorThrown) {
                console.log('textStatus:', textStatus);
                console.log('errorThrown:', errorThrown);

            }

            this.timerUpdateSession = setInterval(function () {

                console.log('CALLING FN: ' + self.BASE_SERVICE + '/do_update_session/' + self.clientID);

                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: self.BASE_SERVICE + '/do_update_session/' + self.clientID,
                    success: successUpdateSession,
                    error: errorUpdateSession
                });

            }, 60 * 1000);

            console.log('STARTING VEHICLE WATCHER, clieniID:', this.clientID, ', customerID:', this.customerID);

            angular.element(document.getElementById('MainWrap'))
                .scope().vm.doStartVehicleWatcher(this.clientID, this.customerID);

            // fai apparire badge con come cliente
            document.getElementById('box_name_cliente').style.display = 'block';
            $('#label_name_cliente').text('CUSTOMER: ' + this.customerID);

            // fai apparire pulsante LOGOUT
            document.getElementById('btn_request_logout').style.display = 'block';

        } else {
            $('#modalLogin #formLoginErrors .bg-danger').text('Invalid credentials');
        }

    };

    ClientApp.prototype.errorLogin = function(jqXHR, textStatus, errorThrown) {
        console.log('textStatus:', textStatus);
        console.log('errorThrown:', errorThrown);

        $('#modalLogin #formLoginErrors .bg-danger').text('Invalid request');
    };



    ClientApp.prototype.submitForm = function() {
        var username = $('#username').val();
        var password = $('#password').val();

        var self = this;

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: this.BASE_SERVICE + '/do_authentication',
            data: {
                username: username,
                password: password
            },
            success: this.successLogin.bind(this),
            error: this.errorLogin.bind(this)
        });

    };

    ClientApp.prototype.closeLoginForm = function() {
        $('#modalLogin').modal('hide');

        // fai apparire pulsante LOGIN
        document.getElementById('btn_request_login').style.display = 'block';
    };

    ClientApp.prototype.submitMissionTrigger = function() {
        // goMission()
        angular.element(document.getElementById('btnSubmitMission')).scope().vm.goMission();
    };

    ClientApp.prototype.activateLogoutRequest = function() {

        function successLogout(data, status, xhr) {
            console.log('SUCCESS LOGOUT!!!');

        }

        function errorLogout(jqXHR, textStatus, errorThrown) {
            console.log('textStatus:', textStatus);
            console.log('errorThrown:', errorThrown);

        }

        console.log('SENDING LOGOUT REQUEST:', this.BASE_SERVICE + '/do_logout/' + this.clientID);
        // send logout request
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: this.BASE_SERVICE + '/do_logout/' + this.clientID,
            success: successLogout,
            error: errorLogout
        });

        clearInterval(this.timerUpdateSession);

        angular.element(document.getElementById('MainWrap'))
            .scope().vm.doStopVehicleWatcher();

        document.getElementById('btn_request_login').style.display = 'block';
        document.getElementById('btn_request_logout').style.display = 'none';

        document.getElementById('box_name_cliente').style.display = 'none';

        $('#label_name_cliente').text('');

    };
        
    ClientApp.prototype.activateLoginRequest = function() {

        document.getElementById('btn_request_login').style.display = 'none';

        // clean form
        $('#modalLogin #formLoginErrors .bg-danger').text('');
        $('#username').val('');
        $('#password').val('');

        $('#modalLogin').modal('show');

    };

    return {
        ClientApp: ClientApp
    };
}();