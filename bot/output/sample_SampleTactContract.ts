import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type Transferr = {
    $$type: 'Transferr';
    sender: Address;
    value: bigint;
    date: bigint;
}

export function storeTransferr(src: Transferr) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.date, 257);
    };
}

export function loadTransferr(slice: Slice) {
    let sc_0 = slice;
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _date = sc_0.loadIntBig(257);
    return { $$type: 'Transferr' as const, sender: _sender, value: _value, date: _date };
}

function loadTupleTransferr(source: TupleReader) {
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _date = source.readBigNumber();
    return { $$type: 'Transferr' as const, sender: _sender, value: _value, date: _date };
}

function storeTupleTransferr(source: Transferr) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeNumber(source.date);
    return builder.build();
}

function dictValueParserTransferr(): DictionaryValue<Transferr> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeTransferr(src)).endCell());
        },
        parse: (src) => {
            return loadTransferr(src.loadRef().beginParse());
        }
    }
}

 type SampleTactContract_init_args = {
    $$type: 'SampleTactContract_init_args';
    deployer: Address;
}

function initSampleTactContract_init_args(src: SampleTactContract_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.deployer);
    };
}

async function SampleTactContract_init(deployer: Address) {
    const __code = Cell.fromBase64('te6ccgECFAEAAqwAART/APSkE/S88sgLAQIBYgIDAprQAdDTAwFxsMABkX+RcOIB+kAiUFVvBPhh7UTQ1AH4YtIAAZn6QAEB9ARZbBKOh/pAAQHR2zziWts8MMj4QgHMfwHKAFlZzxb0AMntVBIEAgEgCgsCzu2i7ftwIddJwh+VMCDXCx/eApJbf+AhwAAh10nBIbCOM1v4QW8kMGwS+COBAQFa+CMEyFUgWs8WEoEBAc8AgQEBzwDJEiBulTBZ9FowlEEz9BXif+AhghCUapi2uuMCAcAAkTDjDXAFBgFGMdMfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8nbPH8HAXD5AYLwUJK13OBxWlfdlp9ftab5MCWgsC6rMpRwyis2XKDX6Tq6jpAhf3CBAIIQI21tbds8f9sx4AgBJvhBbyQQI18Df3BQA4BCAW1t2zwIAfbIcQHKAVAHAcoAcAHKAlAFzxZQA/oCcAHKaCNusyVus7GOTH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMyXMzMBcAHKAOIhbrMJADCcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wACRb4PT2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkEgwCASANDgACMQIBIA8QAkW76s7UTQ1AH4YtIAAZn6QAEB9ARZbBKOh/pAAQHR2zzi2zyBITAkW22B2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkBIRAHG3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHAAClv4J28QAAJtAAIw');
    const __system = Cell.fromBase64('te6cckECFgEAArYAAQHAAQEFoebTAgEU/wD0pBP0vPLICwMCAWIOBAIBIAwFAgEgCAYCRbvqztRNDUAfhi0gABmfpAAQH0BFlsEo6H+kABAdHbPOLbPIFQcAAjACASAKCQBxt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcwTgQKuANwDOxymcsHVcjktlhwAkW22B2omhqAPwxaQAAzP0gAID6Aiy2CUdD/SAAgOjtnnFtnkBULAApb+CdvEAJFvg9PaiaGoA/DFpAADM/SAAgPoCLLYJR0P9IACA6O2ecW2eQVDQACMQKa0AHQ0wMBcbDAAZF/kXDiAfpAIlBVbwT4Ye1E0NQB+GLSAAGZ+kABAfQEWWwSjof6QAEB0ds84lrbPDDI+EIBzH8BygBZWc8W9ADJ7VQVDwLO7aLt+3Ah10nCH5UwINcLH94Cklt/4CHAACHXScEhsI4zW/hBbyQwbBL4I4EBAVr4IwTIVSBazxYSgQEBzwCBAQHPAMkSIG6VMFn0WjCUQTP0FeJ/4CGCEJRqmLa64wIBwACRMOMNcBEQAXD5AYLwUJK13OBxWlfdlp9ftab5MCWgsC6rMpRwyis2XKDX6Tq6jpAhf3CBAIIQI21tbds8f9sx4BMBRjHTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J2zx/EgEm+EFvJBAjXwN/cFADgEIBbW3bPBMB9shxAcoBUAcBygBwAcoCUAXPFlAD+gJwAcpoI26zJW6zsY5MfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzJczMwFwAcoA4iFusxQAMJx/AcoAASBu8tCAAcyVMXABygDiyQH7AAACbd6ZKPg=');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSampleTactContract_init_args({ $$type: 'SampleTactContract_init_args', deployer })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const SampleTactContract_errors: { [key: number]: { message: string } } = {
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
}

export class SampleTactContract implements Contract {
    
    static async init(deployer: Address) {
        return await SampleTactContract_init(deployer);
    }
    
    static async fromInit(deployer: Address) {
        const init = await SampleTactContract_init(deployer);
        const address = contractAddress(0, init);
        return new SampleTactContract(address, init);
    }
    
    static fromAddress(address: Address) {
        return new SampleTactContract(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: SampleTactContract_errors
    };
    
     constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | 'withdraw all' | Deploy) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message === 'withdraw all') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getDeployer(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('deployer', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getBalance(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('balance', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getTransferrs(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('Transferrs', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserTransferr(), source.readCellOpt());
        return result;
    }
    
}