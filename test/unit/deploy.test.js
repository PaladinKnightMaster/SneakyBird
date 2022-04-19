const { expect } = require('chai');
const chai = require('chai');
const spies = require('chai-spies');
const hre = require('hardhat');
const deployScript = require('../../deploy/01-SneakyBird');

chai.use(spies);

describe('deploy script tests', () => {
    let mocks;
    let deployMock;
    let logMock;
    let getMock;
    let deployerMock;
    let getChainIdMock;

    beforeEach(() => {
        deployMock = chai.spy();
        logMock = chai.spy();
        getMock = chai.spy();
        deployerMock = chai.spy();
        getChainIdMock = chai.spy.returns(9999);

        mocks = {
            deployments: {
                deploy: async () => deployMock,
                log: async () => logMock,
                get: async () => getMock,
            },

            getNamedAccounts: async () => ({
                deployer: deployerMock,
            }),

            getChainId: getChainIdMock,
        };
    });

    it('should fund contract with link', async () => {
        await deployScript(mocks);
        const transferMock = chai.spy.returns(async () => ({
            wait: async () => {},
        }));
        hre.ethers.Contract = class Contract {
            constructor() {
                return {};
            }
        };
        chai.spy.on(hre.ethers, 'Contracts', function (...items) {
            console.log({ items });
            return {
                Contract: new Promise((resolve) => {
                    resolve({
                        transfer: transferMock,
                    });
                }),
            };
        });

        expect(getChainIdMock).to.have.been.called();
    });
});
