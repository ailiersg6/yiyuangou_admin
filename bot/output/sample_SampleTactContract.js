"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleTactContract = exports.loadTransferr = exports.storeTransferr = exports.loadDeployOk = exports.storeDeployOk = exports.loadDeploy = exports.storeDeploy = exports.loadSendParameters = exports.storeSendParameters = exports.loadContext = exports.storeContext = exports.loadStateInit = exports.storeStateInit = void 0;
const ton_core_1 = require("ton-core");
function storeStateInit(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
exports.storeStateInit = storeStateInit;
function loadStateInit(slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
exports.loadStateInit = loadStateInit;
function loadTupleStateInit(source) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeTupleStateInit(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserStateInit() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    };
}
function storeContext(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}
exports.storeContext = storeContext;
function loadContext(slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
exports.loadContext = loadContext;
function loadTupleContext(source) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
function storeTupleContext(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}
function dictValueParserContext() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    };
}
function storeSendParameters(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
exports.storeSendParameters = storeSendParameters;
function loadSendParameters(slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
exports.loadSendParameters = loadSendParameters;
function loadTupleSendParameters(source) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
function storeTupleSendParameters(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserSendParameters() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    };
}
function storeDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeploy = storeDeploy;
function loadDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
exports.loadDeploy = loadDeploy;
function loadTupleDeploy(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function storeTupleDeploy(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeploy() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployOk(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
exports.storeDeployOk = storeDeployOk;
function loadDeployOk(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
exports.loadDeployOk = loadDeployOk;
function loadTupleDeployOk(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function storeTupleDeployOk(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeployOk() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    };
}
function storeTransferr(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.date, 257);
    };
}
exports.storeTransferr = storeTransferr;
function loadTransferr(slice) {
    let sc_0 = slice;
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _date = sc_0.loadIntBig(257);
    return { $$type: 'Transferr', sender: _sender, value: _value, date: _date };
}
exports.loadTransferr = loadTransferr;
function loadTupleTransferr(source) {
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _date = source.readBigNumber();
    return { $$type: 'Transferr', sender: _sender, value: _value, date: _date };
}
function storeTupleTransferr(source) {
    let builder = new ton_core_1.TupleBuilder();
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeNumber(source.date);
    return builder.build();
}
function dictValueParserTransferr() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef((0, ton_core_1.beginCell)().store(storeTransferr(src)).endCell());
        },
        parse: (src) => {
            return loadTransferr(src.loadRef().beginParse());
        }
    };
}
function initSampleTactContract_init_args(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.deployer);
    };
}
async function SampleTactContract_init(deployer) {
    const __code = ton_core_1.Cell.fromBase64('te6ccgECFAEAAqwAART/APSkE/S88sgLAQIBYgIDAprQAdDTAwFxsMABkX+RcOIB+kAiUFVvBPhh7UTQ1AH4YtIAAZn6QAEB9ARZbBKOh/pAAQHR2zziWts8MMj4QgHMfwHKAFlZzxb0AMntVBIEAgEgCgsCzu2i7ftwIddJwh+VMCDXCx/eApJbf+AhwAAh10nBIbCOM1v4QW8kMGwS+COBAQFa+CMEyFUgWs8WEoEBAc8AgQEBzwDJEiBulTBZ9FowlEEz9BXif+AhghCUapi2uuMCAcAAkTDjDXAFBgFGMdMfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8nbPH8HAXD5AYLwUJK13OBxWlfdlp9ftab5MCWgsC6rMpRwyis2XKDX6Tq6jpAhf3CBAIIQI21tbds8f9sx4AgBJvhBbyQQI18Df3BQA4BCAW1t2zwIAfbIcQHKAVAHAcoAcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOTH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMyXMzMBcAHKAOIhbrMJADCcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wACRb4PT2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkEgwCASANDgACMQIBIA8QAkW76s7UTQ1AH4YtIAAZn6QAEB9ARZbBKOh/pAAQHR2zzi2zyBITAkW22B2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkBIRAHG3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHAAClv4J28QAAJtAAIw');
    const __system = ton_core_1.Cell.fromBase64('te6cckECFgEAArYAAQHAAQEFoebTAgEU/wD0pBP0vPLICwMCAWIOBAIBIAwFAgEgCAYCRbvqztRNDUAfhi0gABmfpAAQH0BFlsEo6H+kABAdHbPOLbPIFQcAAjACASAKCQBxt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcwTgQKuANwDOxymcsHVcjktlhwAkW22B2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkBULAApb+CdvEAJFvg9PaiaGoA/DFpAADM/SAAgPoCLLYJR0P9IACA6O2ecW2eQVDQACMQKa0AHQ0wMBcbDAAZF/kXDiAfpAIlBVbwT4Ye1E0NQB+GLSAAGZ+kABAfQEWWwSjof6QAEB0ds84lrbPDDI+EIBzH8BygBZWc8W9ADJ7VQVDwLO7aLt+3Ah10nCH5UwINcLH94Cklt/4CHAACHXScEhsI4zW/hBbyQwbBL4I4EBAVr4IwTIVSBazxYSgQEBzwCBAQHPAMkSIG6VMFn0WjCUQTP0FeJ/4CGCEJRqmLa64wIBwACRMOMNcBEQAXD5AYLwUJK13OBxWlfdlp9ftab5MCWgsC6rMpRwyis2XKDX6Tq6jpAhf3CBAIIQI21tbds8f9sx4BMBRjHTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J2zx/EgEm+EFvJBAjXwN/cFADgEIBbW3bPBMB9shxAcoBUAcBygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY5MfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzJczMwFwAcoA4iFusxQAMJx/AcoAASBu8tCAAcyVMXABygDiyQH7AAACbd6ZKPg=');
    let builder = (0, ton_core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSampleTactContract_init_args({ $$type: 'SampleTactContract_init_args', deployer })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const SampleTactContract_errors = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
};
class SampleTactContract {
    static async init(deployer) {
        return await SampleTactContract_init(deployer);
    }
    static async fromInit(deployer) {
        const init = await SampleTactContract_init(deployer);
        const address = (0, ton_core_1.contractAddress)(0, init);
        return new SampleTactContract(address, init);
    }
    static fromAddress(address) {
        return new SampleTactContract(address);
    }
    constructor(address, init) {
        this.abi = {
            errors: SampleTactContract_errors
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message === null) {
            body = new ton_core_1.Cell();
        }
        if (message === 'withdraw all') {
            body = (0, ton_core_1.beginCell)().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof ton_core_1.Slice) && message.$$type === 'Deploy') {
            body = (0, ton_core_1.beginCell)().store(storeDeploy(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getDeployer(provider) {
        let builder = new ton_core_1.TupleBuilder();
        let source = (await provider.get('deployer', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    async getBalance(provider) {
        let builder = new ton_core_1.TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getTransferrs(provider) {
        let builder = new ton_core_1.TupleBuilder();
        let source = (await provider.get('Transferrs', builder.build())).stack;
        let result = ton_core_1.Dictionary.loadDirect(ton_core_1.Dictionary.Keys.BigInt(257), dictValueParserTransferr(), source.readCellOpt());
        return result;
    }
}
exports.SampleTactContract = SampleTactContract;
