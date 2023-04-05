const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

const app = require('express/lib/router');
const session = require('express-session');

const { expect } = chai;
chai.use(sinonChai);

const logoutModule = rewire('../../../src/controller/logout');

describe('logout function', () => {
    let req, res, getAcronymsStub;

    beforeEach(() => {
        req = {
            session: {
                destroy: () => {}
            }
        };
        res = {
            send: () => {}
        };
        getAcronymsStub = sinon.stub();
        logoutModule.__set__('getAcronyms', getAcronymsStub);

        // Check if console.log has already been wrapped by Sinon
        if (!console.log.restore) {
            sinon.stub(console, 'log');
        }
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should destroy session', () => {
        const destroyStub = sinon.stub(req.session, 'destroy').yields();
        logoutModule.logout(req, res);
        expect(destroyStub.calledOnce).to.be.true;
    });

    it('should log session destroyed message to console and call getAcronyms', () => {
        const destroyStub = sinon.stub(req.session, 'destroy').yields();
        logoutModule.logout(req, res);
        expect(console.log.calledWith('Session destroyed')).to.be.true;
        expect(getAcronymsStub).to.be.calledOnce;
    });

    it('should handle session destroy error', () => {
        const error = new Error('Session destroy error');
        const destroyStub = sinon.stub(req.session, 'destroy').yields(error);
        sinon.stub(console, 'error');
        logoutModule.logout(req, res);
        expect(console.error.calledWith(error)).to.be.true;
    });
});
