module.exports = {
    isOwner:function(request, response) {
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = `
        <a href="/auth/login">login</a> |
        <a href="/auth/register">Register</a> |
        <a href="/auth/facebook">Login with Facebook</a>`
        if (this.isOwner(request, response)) {
            authStatusUI = `${request.user} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}