var LoginForm = Robin.Model.extend({
    attributes: {
        username: '',
        password: '',
        rememberMe: false
    },
    validate: function(attribute) {
        if (!attribute || attribute == 'username') {
            this.validateUsername();
        }
        if (!attribute || attribute == 'password') {
            this.validatePassword();
        }
    },
    validateUsername: function() {
        this.clearError('username');
        var length = this.get('username').length;

        if (!length) {
            this.addError('username', '用户名不得为空');
        } else if (length < 6) {
            this.addError('username', '用户名不得小于6个字符');
        } else if (length > 12) {
            this.addError('username', '用户名不得大于12个字符');
        }
    },
    validatePassword: function() {
        this.clearError('password');
        var length = this.get('password').length;

        if (!length) {
            this.addError('password', '密码不得为空');
        } else if (length < 6) {
            this.addError('password', '密码不得小于6个字符');
        } else if (length > 12) {
            this.addError('password', '密码不得大于12个字符');
        }
    },
    submit: function() {
        $.ajax({
            url: '/login',
            data: this.attributes,
            dataType: 'json',
            success: function(data) {
            },
            error: function() {
            }
        });
    }
});

login_form = new LoginForm();

login_form.on('change:username', function() {
    $('#username').next('.helper-message').text('');
});

login_form.on('change:password', function() {
    $('#password').next('.helper-message').text('');
});

login_form.on('error:username', function() {
    $('#username').next('.helper-message').text(this.getError('username')[0]);
});

login_form.on('error:password', function() {
    $('#password').next('.helper-message').text(this.getError('password')[0]);
});

$('#username').on('keyup blur', function() {
    login_form.set('username', $(this).val());
});

$('#password').on('keyup blur', function() {
    login_form.set('password', $(this).val());
});
