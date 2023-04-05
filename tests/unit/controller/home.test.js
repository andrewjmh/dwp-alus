const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const app = require('express/lib/router');
const session = require('express-session');

const homeModule = rewire('../../../src/controller/home');

describe('getHome function', () => {
    let req, res, renderStub;

    beforeEach(() => {
        req = {};
        res = {
            render: () => {}
        };
        renderStub = sinon.stub(res, 'render');
    });

    it('should render the home template', async () => {
        await homeModule.getHome(req, res);
        expect(renderStub.calledOnceWithMatch(sinon.match('src/views/home.njk'))).to.be.true;
    });

    it('should log an error and "its broken" message if rendering fails', async () => {
        const error = new Error('Rendering failed');
        res.render.throws(error);
        sinon.stub(console, 'log');
        await homeModule.getHome(req, res);
        expect(console.log.calledWith(error)).to.be.true;
        expect(console.log.calledWith('Failed to get home page')).to.be.true;
        expect(console.log).to.be.calledWith('Failed to get home page');
        console.log.restore();
    });
});
