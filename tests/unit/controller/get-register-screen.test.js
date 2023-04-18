const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const controllerModule = rewire('../../../src/controller/get-register-screen');

describe('getRegisterScreen function', () => {
    let req, res, renderStub;

    beforeEach(() => {
        req = {};
        res = {
            render: () => {}
        };
        renderStub = sinon.stub(res, 'render');
    });

    it('should render the register template', async () => {
        await controllerModule.getRegisterScreen(req, res);
        expect(renderStub.calledOnceWithMatch(sinon.match('src/views/register.njk'))).to.be.true;
    });

    it('should log an error and "error rendering page" message if rendering fails', async () => {
        const error = new Error('Rendering failed');
        res.render.throws(error);
        sinon.stub(console, 'log');
        await controllerModule.getRegisterScreen(req, res);
        expect(console.log.calledWith(error)).to.be.true;
        expect(console.log.calledWith('error rendering page')).to.be.true;
        console.log.restore();
    });
});
