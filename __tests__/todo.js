const request = require('supertest')

const db = require('../models/index')
const app= require('../server')

let server,agent;

describe('Todo test suite',() => {
    beforeAll(async () => {
        await db.sequelize.sync({force : true})
        server = app.listen(5000,() => {})
        agent = request.agent(server)
    })
    afterAll(async ()=> {
        await db.sequelize.close()
        server.close();
    })
    test('responds with json at /todos',async () =>  {
        const response = await agent.post('/todos').send({
            'title':'buy milk',
            dueDate : new Date().toISOString(),
            completed : false
        })
        expect(response.statusCode).toBe(302)
    })
 /*    test('Mark a todo as complete', async () => {
        const response = await agent.post('/todos').send({
            'title':'buy milk',
            dueDate : new Date().toISOString(),
            completed : false
        })

        const parsedResponse = JSON.parse(response.text)
        const todoID = parsedResponse.id

        expect(parsedResponse.completed).toBe(false);
        const markAsCompleteResponse = await agent.put(`/todos/${todoID}/markAsCompleted`).send();
        const parsedUpdatedResponse = JSON.parse(markAsCompleteResponse.text)
        expect(parsedUpdatedResponse.completed).toBe(true)
    })
    test('should delete a todo with a valid ID', async () => {
        // Assuming you have a todo created for testing, replace '1' with the actual ID
        const addedResponse = await agent.post('/todos').send({
            'title':'buy milk',
            dueDate : new Date().toISOString(),
            completed : false
        })
        
        const parsedResponse = JSON.parse(addedResponse.text)
        const todoID = parsedResponse.id
        const response = await agent.delete(`/todos/${todoID}`);
    
        expect(response.status).toBe(200);
        expect(response.body.deletedTodo).toBeDefined();
      }); */
    
      /* test('should return 404 for non-existent todo', async () => {
        const response = await agent.delete('/todos/999');
    
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Todo not found');
      }); */
})