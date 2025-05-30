import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import app from '../dist/server.js'
const request = supertest(app)

describe('JSON-RPC /rpc', () => {
    it('list_tools → returns an array', async () => {
        const res = await request
            .post('/rpc')
            .send({ jsonrpc: '2.0', id: 1, method: 'list_tools', params: {} })

        expect(res.statusCode).toBe(200)
        expect(res.body.result.tools.length).toBeGreaterThan(0)
    })

    it('call_tool unknown → error -32603', async () => {
        const res = await request
            .post('/rpc')
            .send({
                jsonrpc: '2.0',
                id: 2,
                method: 'call_tool',
                params: { name: 'does_not_exist', arguments: {} }
            })

        expect(res.statusCode).toBe(500)
        expect(res.body.error.message).toMatch(/Unknown tool/)
    })
})
