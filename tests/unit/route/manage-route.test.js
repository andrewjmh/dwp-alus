const rewire = require('rewire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('getRoutes', () => {
    describe('index', () => {
        const stubGet = sinon.stub();
        const stubPost = sinon.stub();
        const stubDelete = sinon.stub();
        const fakeUpdateArucMarkback = 'arucUpdateMarkback';
        const fakeGetArucNumbers = 'getArucNumbers';
        const fakeGetArucReports = 'getArucReports';
        const fakeGetEvent = 'getEvent';
        const fakeGetException = 'getException';
        const fakeUpdateEventMarkback = 'updateEventMarkback';
        const fakeUpdateArucReported = 'updateArucReported';
        const fakeUpdateEventReported = 'updateEventReported';
        const fakeApp = {get: stubGet, post: stubPost, delete: stubDelete};
        const stubRouter = sinon.stub().returns(fakeApp);
        const fakeExpress = {Router: stubRouter};

        const indexRoute = rewire('../../../src/route/manage-routes');

        indexRoute.__set__('express', fakeExpress);
        indexRoute.__set__('updateArucMarkback', fakeUpdateArucMarkback);
        indexRoute.__set__('getArucNumbers', fakeGetArucNumbers);
        indexRoute.__set__('getArucReports', fakeGetArucReports);
        indexRoute.__set__('getEvent', fakeGetEvent);
        indexRoute.__set__('getException', fakeGetException);
        indexRoute.__set__('updateEventMarkback', fakeUpdateEventMarkback);
        indexRoute.__set__('updateArucReported', fakeUpdateArucReported);
        indexRoute.__set__('updateEventReported', fakeUpdateEventReported);

        indexRoute.getRoutes();

        it('should call express.Router', () => {
            expect(stubRouter).have.callCount(1);
        });

        it('should call app.get', () => {
            expect(stubGet).have.callCount(6);
        });

        it('should call app.post', () => {
            expect(stubPost).have.callCount(9);
        });

        it('should call app.delete', () => {
            expect(stubDelete).have.callCount(0);
        });
    });
});
