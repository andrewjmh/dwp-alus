const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const sinonChai = require('sinon-chai');

const { expect } = chai;
chai.use(sinonChai);

const controllerModule = rewire('../../../src/controller/get-edit-suggestion-screen');

describe('getEditSuggestionScreen function', () => {
    let req, res, renderStub;

    beforeEach(() => {
        req = {
            body: { suggestion_id: 123 }
        };
        res = {
            render: () => {}
        };
        renderStub = sinon.stub(res, 'render');
    });

    it('should render the edit-suggestion template with suggestion_id', async () => {
        await controllerModule.getEditSuggestionScreen(req, res);
        expect(renderStub.calledOnceWith('edit-suggestion', { suggestion_id: 123 })).to.be.true;
    });

    it('should log an error and "error rendering page" message if rendering fails', async () => {
        const error = new Error('Rendering failed');
        res.render.throws(error);
        sinon.stub(console, 'log');
        await controllerModule.getEditSuggestionScreen(req, res);
        expect(console.log.calledWith(error)).to.be.true;
        expect(console.log.calledWith('error rendering page')).to.be.true;
        console.log.restore();
    });
});
