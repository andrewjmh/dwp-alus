const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const app = require('express/lib/router');
const session = require('express-session');

const controllerModule = rewire('../../../src/controller/get-login-screen');

describe('getLoginScreen function', () => {
    let req, res, renderStub;

    beforeEach(() => {
        req = {};
        res = {
            render: () => {}
        };
        renderStub = sinon.stub(res, 'render');
    });

    it('should render the login template', async () => {
        await controllerModule.getLoginScreen(req, res);
        expect(renderStub.calledOnceWithMatch(sinon.match('src/views/login.njk'))).to.be.true;
    });

    it('should log an error and "error rendering page" message if rendering fails', async () => {
        const error = new Error('Rendering failed');
        res.render.throws(error);
        sinon.stub(console, 'log');
        await controllerModule.getLoginScreen(req, res);
        expect(console.log.calledWith(error)).to.be.true;
        expect(console.log.calledWith('error rendering page')).to.be.true;
        console.log.restore();
    });
});
