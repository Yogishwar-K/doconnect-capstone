describe('User Login Flow', () => {
  it('successfully logs in and redirects to the authenticated home feed', () => {
    // 1. Visit the login page
    cy.visit('http://localhost:3000/login');

    // 2. Type in credentials
    // IMPORTANT: Make sure this user actually exists in your local MongoDB!
    cy.get('input[placeholder="Enter email"]').type('testuser@doconnect.com');
    cy.get('input[placeholder="Password"]').type('password123');

    // 3. Click the login button
    cy.get('button[type="submit"]').click();

    // 4. Verify the URL changed to the root
    cy.url().should('eq', 'http://localhost:3000/');

    // Verify the UI updated to the logged-in state
    // This looks for the text we added to your authenticated Home.js feed
    cy.contains('DoConnect Feed').should('be.visible');
    
    // Check if the Navbar updated to show the user profile
    cy.contains('Hello,').should('be.visible');
  });
});