import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature(
  'server/tests/user-registration.feature',
);

defineFeature(feature, (test) => {
    let testServer: TestServer;
    let httpServer: request.SuperTest<request.Test>;
  
    beforeAll(() => {
      testServer = getTestServer();
      httpServer = request(testServer.serverApplication.getHttpServer());
    });
  
    afterAll(async () => {
      await getConnection().close();
    });
  
    afterEach(async () => {
      await cleanUpTestData();
    });

    test('Creating a new account', ({
        given,
        when,
        and,
        then
    }) => {
        given('I am on the registration page', () => {
            throw new Error('Not implemented yet');
        });
    
        when('I enter the following user details:', (table) => {
            throw new Error('Not implemented yet');
        });
    
        and('I submit the registration form', () => {
            throw new Error('Not implemented yet');
        });
    
        then('I should be registered', () => {
            throw new Error('Not implemented yet');
        });
    
        and('I should have the deifned pseudo', () => {
            throw new Error('Not implemented yet');
        });
    
        and('I should have the defined username', () => {
            throw new Error('Not implemented yet');
        });
    
        and('I should have the defined email', () => {
            throw new Error('Not implemented yet');
        });
    
        and('I should have the defined password (hashed)', () => {
            throw new Error('Not implemented yet');
        });
    });
});