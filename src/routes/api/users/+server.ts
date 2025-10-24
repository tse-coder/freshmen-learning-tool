// fetch all the users and return them as json
import type { RequestHandler } from '@sveltejs/kit';
import { getAllUsers } from '../../../api/controllers/users';


export const GET: RequestHandler = async () => {
    try {
        const users = await getAllUsers();
        console.log(users)
        return new Response(JSON.stringify(users), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};