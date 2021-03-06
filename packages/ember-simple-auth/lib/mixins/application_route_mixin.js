/**
  The mixin for the application controller. This defines the `login` and
  `logout` actions so that you can simply add buttons or links in every template
  like this:

  ```handlebars
  {{#if session.isAuthenticated}}
    <a {{ action 'logout' }}>Logout</a>
  {{else}}
    <a {{ action 'login' }}>Login</a>
  {{/if}}
  ```

  @class ApplicationRouteMixin
  @namespace Ember.SimpleAuth
  @extends Ember.Mixin
  @static
*/
Ember.SimpleAuth.ApplicationRouteMixin = Ember.Mixin.create({
  actions: {
    /**
      The login action by default redirects to the login route (or any other
      route defined as `loginRoute` in
      [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup)). When integrating with
      an external authentication provider, this action should be overridden so
      that it opens the external provider's UI in a new window, e.g.:

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        actions: {
          login: function() {
            window.open('https://www.facebook.com/dialog/oauth...');
          }
        }
      });
      ```

      @method login
    */
    login: function() {
      this.transitionTo(Ember.SimpleAuth.loginRoute);
    },

    /**
      This action is invoked when a user successfully logs in. By default it
      will retry a potentially intercepted transition
      (see [AuthenticatedRouteMixin#beforeModel](#Ember.SimpleAuth.AuthenticatedRouteMixin_beforeModel))
      or if none was intercepted redirect to the route configured as
      `routeAfterLogin` in [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup).

      @method loginSucceeded
    */
    loginSucceeded: function() {
      var attemptedTransition = this.get('session.attemptedTransition');
      if (attemptedTransition) {
        attemptedTransition.retry();
        this.set('session.attemptedTransition', undefined);
      } else {
        this.transitionTo(Ember.SimpleAuth.routeAfterLogin);
      }
    },

    /**
      This action is invoked when login fails. This does nothing by default but
      can be overridden and used to display generic error messages etc. If
      you're using an external authentication provider you might also want to
      override it to display the external provider's error message (any
      arguments you pass to
      [Ember.SimpleAuth#externalLoginSucceeded](#Ember.SimpleAuth_externalLoginSucceeded)
      will be forwarded to this action), e.g.:

      ```javascript
      App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
        actions: {
          loginFailed: function(error) {
            this.controllerFor('application').set('loginErrorMessage', error.message);
          }
        }
      });
      ```

      @method loginFailed
    */
    loginFailed: function() {
    },

    /**
      The logout action destroys the current session (see
      [Session#destroy](#Ember.SimpleAuth.Session_destroy)) and redirects to the
      route defined as `routeAfterLogout` in
      [Ember.SimpleAuth.setup](#Ember.SimpleAuth_setup).

      @method logout
    */
    logout: function() {
      this.get('session').destroy();
      this.transitionTo(Ember.SimpleAuth.routeAfterLogout);
    }
  }
});
