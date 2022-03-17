import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createShortUrl (req, res) {
    const url = req.body;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    if(!url){
        return res.sendStatus(400);
    }
    const urlHash = bcrypt.hashSync(url, 10);
    // use urlHash.slice(0, 8) to get from first until element with indice == 7, 8 elements...
    const shortUrl = urlHash.slice(0, 8);


    try {
        const result = await connection.query(`
            SELECT * FROM sessions WHERE token = $1;
        `, [token]);
        const userId = result[0].userId;

        await connection.query(`
            INSERT INTO urls 
                ("userId", url, "shortUrl", "visitCount") 
            VALUES 
                ($1, $2, $3, $4);
        `, [userId, url, shortUrl, 0]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}