import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature(
  'tests/test.feature',
);

defineFeature(feature, test => {
    test('Sunday isn\'t Friday', ({
      given,
      when,
      then
    }) => {
      given('today is Sunday', () => {
  
      });
  
      when('I ask whether it\'s Friday yet', () => {
  
      });
  
      then(/^I should be told (.*)$/, (arg0) => {
        
      });
    });
  });
