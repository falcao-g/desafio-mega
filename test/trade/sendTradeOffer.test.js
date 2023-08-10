const request = require('supertest');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { api } = require('../../src/api');
const { database } = require('../../src/database/knex');
const { ItemType } = require('../../src/database/type/itemtype')

const SEND_TRADE_ROUTE = '/trade'

let playerProposer;
let playerAcceptor;
let playerJwt;

beforeAll(async () => {
    // Create proposer player
    const proposerName = 'Proposer';
    const proposerLogin = `login_proposer_${Date.now()}`;
    const proposerPassword = 'pr0p053r_p@55w0rd';
    await database.auth.registerPlayer(proposerName, proposerLogin, proposerPassword);
    playerProposer = await database.auth.findOne(proposerLogin);
    playerJwt = jwt.sign(playerProposer, process.env.SECRET);
    
    // Create acceptor player
    const acceptorName = 'Acceptor';
    const acceptorLogin = `login_acceptor_${Date.now()}`;
    const acceptorPassword = '4cc3pt0r_p@55w0rd';
    await database.auth.registerPlayer(acceptorName, acceptorLogin, acceptorPassword);
    playerAcceptor = await database.auth.findOne(acceptorLogin);
})

afterAll(async () => {
    await database('player')
        .del()
        .where({ uuid: playerProposer.uuid })
})

test.skip('shouldn\'t create a trade offer for an unauthenticated proposer', async () => {
    const response = await request(api)
        .post(SEND_TRADE_ROUTE)
        .set('Cookie', `jwt=${playerJwt}`)
        .send({

    });
})

test('should create a trade offer', async () => {
    const offeredItem = {
        uuid: uuidv4(),
        owner: playerProposer.uuid,
        type: ItemType.MATERIAL,
        name: 'Stone',
        value: 20,
    };
    await database.inventory.insertOne(offeredItem);
    const requestedItem = {
        uuid: uuidv4(),
        owner: playerAcceptor.uuid,
        type: ItemType.SWORD,
        name: 'Katana',
        value: 50,
    };
    await database.inventory.insertOne(requestedItem);

    const tradeOffer = {
        acceptor: playerAcceptor.uuid,
        offeredItems: [ offeredItem.uuid ],
        requestedItems: [ requestedItem.uuid ],
    }

    const response = await request(api)
        .post(SEND_TRADE_ROUTE)
        .set('Cookie', `jwt=${playerJwt}`)
        .send(tradeOffer);
    expect(response).toHaveProperty('status', 201);
    expect(response).toHaveProperty('body', { ...tradeOffer, proposer: playerProposer.uuid });

    await database.inventory.deleteOneById(offeredItem.uuid);
    await database.inventory.deleteOneById(requestedItem.uuid);
})

test.skip('shouldn\'t create a trade offer with invalid items uuid', () => {

})

test.skip('shoudln\'t create a trade for a unexistent acceptor', () => {
    
})

test.skip('shoudln\'t create a trade for a invalid acceptor uuid', () => {
    
})

test.skip('shoudln\'t create a trade offer without any items', () => {
    
})
