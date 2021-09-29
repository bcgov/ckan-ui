import { expect } from 'chai';
import { canDelete, canView, UnknownRoleError, UnknownStateError, UnknownRecordTypeError } from '@/lib/deletionAndVisibilityLogic.js';
import { ticket519Table, refersToVisibility, refersToDeletability } from './data/519-rules.js';

const ROLES = ["sysadmin", "admin", "editor", "logged in with no role", "public"];
const RECORD_TYPES = ["resource", "dataset"];
const STATES = ["draft", "pending publish", "published", "pending archive", "archived"];


let deletabilityRules = ticket519Table.filter(refersToDeletability);
let visibilityRules = ticket519Table.filter(refersToVisibility);


describe('lib/deletionAndVisibilityLogic.js', () => {

  describe('general deletion logic', () => {

    it('should be possible to delete anything as a sysadmin', () => {
      RECORD_TYPES.forEach(type => {
        STATES.forEach(state => {
          expect(canDelete('sysadmin', type, state)).to.equal(true);
        });
      });
    });

    it('should throw an error for unknown roles', () => {
      expect(() => {
        canDelete('foo', 'record', 'draft');
      }).to.throw(UnknownRoleError);
    });

    it('should throw an error for unknown record types', () => {
      expect(() => {
        canDelete('sysadmin', 'foo', 'draft');
      }).to.throw(UnknownRecordTypeError);
    });  

    it('should throw an error for unknown states', () => {
      expect(() => {
        canDelete('sysadmin', 'record', 'foo');
      }).to.throw(UnknownStateError);
    });

    it('should not throw an error for known roles', () => {
      expect(() => { ROLES.forEach(r => canDelete(r, 'resource', 'draft')); }).to.not.throw();
    });

    it('should return true or false for any valid combination', () => {
      ROLES.flatMap(role => RECORD_TYPES.map(type => [role, type])).forEach(([role, type]) => {
        expect(canDelete(role, type, 'draft')).to.be.a('boolean');
      });
    });

  });


  describe('parsed rules', () => {

    it('should have at least 20 deletability rules', () => {
      expect(deletabilityRules).length.to.be.greaterThan(20);
    });

    // Hidden records are specified explicitly.
    // Visibile records are specified implicitly by omission.
    // Thus, we only expect to see a handful of visibility rules.
    it('should have at least 5 visibility rules', () => {
      expect(visibilityRules).length.to.be.greaterThan(5);
    });  

    it('should only have rules pertaining to visibility or deletability', () => {
      expect(ticket519Table.filter(row => refersToVisibility(row) || refersToDeletability(row)).length).to.equal(ticket519Table.length); 
    });

    it('should have some rules pertaining to deletability', () => {
      expect(ticket519Table.filter(refersToDeletability).length).to.be.within(1, ticket519Table.length-2);
    });

    it('should describe known roles', () => {
      expect(new Set(ticket519Table.map(rule => rule[0]))).to.deep.equal(new Set(ROLES));
    });

    it('should describe known record types', () => {
      expect(new Set(ticket519Table.map(rule => rule[1]))).to.deep.equal(new Set(RECORD_TYPES));
    });

    it('should not have any intersection between deletability and visibility rules', () => {
      deletabilityRules.forEach(rule => {
        expect(visibilityRules).to.not.include(rule);
      });
    });

  });


  // this is driven by ./data/519-rules.html
  describe('specified behaviour for deletability (bcgov#519)', () => {

    deletabilityRules.forEach(([role, recordType, datasetStatus, expected]) => {

      describe(
        describeRuleTarget(role, recordType, datasetStatus),
        () => {
          it(`should be ${expected.toLowerCase()}`, () => {
            expect(canDelete(role, recordType, datasetStatus)).to.equal(/\bable to delete/.test(expected));
          });
        }
      );

    });

  });


  // this is also driven by ./data/519-rules.html
  describe('specified behaviour for visibility (bcgov#519)', () => {

    // we're going for comprehensive coverage of visibility rules here, so
    // iterate through every possible combination or foles/record type/state.
    for (let role of ROLES) {
      for (let type of RECORD_TYPES) {
        for (let state of STATES) {
          describe(
            describeRuleTarget(role, type, state),
            () => {

              // check to see if specified
              let matchingRule = visibilityRules.find(([ruleRole, ruleType, ruleState]) => 
                ruleRole === role && ruleType === type && ruleState === state
              );

              if (matchingRule) {

                if (matchingRule[3] === "unable to view record") {
                  it('should not be visible', () => {
                    expect(canView(role, type, state)).to.equal(false);
                  });
                } else {
                  throw new Error("Unexpected visibility rule value: " + matchingRule[3]);
                }

              } else {
                it('should be visible', () => {
                    expect(canView(role, type, state)).to.equal(true);
                });
              }

            }
          );
        }
      }
    }

  });

});


function describeRuleTarget(role, type, state) {
  return `${role} viewing ${type} ` +
         (type === "dataset"
          ? `that is ${state}`
          : `with parent dataset that is ${state}`);
}
