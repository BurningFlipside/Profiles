describe('user login', () => {
  context('using login url', () => {
    beforeEach(() => {
      cy.visit('/login.php');
    });

    it('says Burning Flipside Profile Login', () => {
      cy.get('body').contains('Burning Flipside Profile Login');
    });

    it('when submitting empty form', () => {
      cy.get('#login_main_form').children('button[type=submit]').click();
      // there is no visible feedback that an error has occurred
    });
  });

  context('using login modal', () => {
    let base = new URL(Cypress.config().baseUrl).pathname;

    beforeEach(() => {
      cy.logout();
      cy.visit('/');

      cy.server();
      cy.route({method: 'POST', url: base+'/api/v1/login', onAbort: () => {console.log(arguments);}}).as('authenticate');
    });
    
    it('says Burning Flipside Profile Login', () => {
      cy.get('a').contains('Login').click();
      cy.get('#login-dialog').contains('Login');
    });

    it('when submitting empty form', () => {
      cy.get('a').contains('Login').click();
      cy.get('#login_dialog_form').children('button[type=submit]').click();
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(403);
	cy.location().should((loc) => {
		expect(loc.pathname).to.eq(base+'/login.php');
	});
        cy.get('body').contains('Login Failed!');
      });
    });

    it('form can be submitted by pressing the enter key', () => {
      cy.get('a').contains('Login').click();
      cy.get('#login_dialog_form').children('input[name=username]').type('me@example.com{enter}');
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(403);
        // I expect there should be visible feedback that an error has occurred
        // there is none
      });
    });

    it('when submitting incomplete credentials', () => {
      cy.get('a').contains('Login').click();
      cy.get('#login_dialog_form').children('input[name=username]').type('gooduser');
      cy.get('#login_dialog_form').children('button[type=submit]').click();
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(403);
        // I expect there should be visible feedback that an error has occurred
        // there is none
      });
    });

    it('when submitting invalid credentials', () => {
      cy.get('a').contains('Login').click();
      cy.wait(200); //give the dialog time to render, otherwise this sometimes types in the wrong fields	   
      cy.get('#login_dialog_form').children('input[name=username]').type('gooduser');
      cy.get('#login_dialog_form').children('input[name=password]').type('badpass');
      cy.get('#login_dialog_form').children('button[type=submit]').click();
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(403);
        // I expect there should be visible feedback that an error has occurred
        // there is none
      });
    });

    it('allows login using username', () => {
      cy.get('a').contains('Login').click();
      cy.wait(200); //give the dialog time to render, otherwise this sometimes types in the wrong fields	    
      cy.get('#login_dialog_form').children('input[name=username]').type('gooduser');
      cy.get('#login_dialog_form').children('input[name=password]').type('goodpass');
      cy.get('#login_dialog_form').children('button[type=submit]').click();
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(200);

        cy.location().should((location) => {
          expect(location.pathname).to.eq(base+'/');
        });

	cy.get('body').contains('Logout');
      });
    });

    it('allows login using email sddress', () => {
      cy.get('a').contains('Login').click();
      cy.wait(200); //give the dialog time to render, otherwise this sometimes types in the wrong fields	    
      cy.get('#login_dialog_form').children('input[name=username]').type('good@example.org');
      cy.get('#login_dialog_form').children('input[name=password]').type('goodpass');
      cy.get('#login_dialog_form').children('button[type=submit]').click();
      cy.wait('@authenticate').then((xhr) => {
        expect(xhr.status).to.eq(200);

        cy.location().should((location) => {
          expect(location.pathname).to.eq(base+'/');
        });

	cy.get('body').contains('Logout');
      });
    });
  });
});
