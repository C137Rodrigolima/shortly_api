import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createShortUrl (req, res) {
    const {url} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    if(!url){
        return res.sendStatus(400);
    }
    const urlHash = bcrypt.hashSync(url, 10);
    // use urlHash.slice(0, 8) to get from first until element with indice == 7,
    //that means 8 elements...
    const shortUrl = urlHash.slice(0, 8);

    try {
        const result = await connection.query(`
            SELECT * FROM sessions WHERE token = $1;
        `, [token]);
        const userId = result.rows[0].userId;

        if(result.rowCount === 0){
            return res.sendStatus(401);
        }

        await connection.query(`
            INSERT INTO urls 
                ("userId", url, "shortUrl", "visitCount") 
            VALUES 
                ($1, $2, $3, $4);
        `, [userId, url, shortUrl, 0]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function getUrls(req, res) {
    const {id} = req.params;

    try {
        const result = await connection.query(`
            SELECT urls.id, urls."shortUrl", urls.url
                FROM urls
            WHERE id = $1;
        `, [id]);
        if(result.rowCount === 0){
            return res.sendStatus(404);
        }

        await connection.query(`
            UPDATE urls SET "visitCount"=urls."visitCount"+1 WHERE id=$1;
        `, [id]);

        res.sendStatus(200).send(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function deleteUrl(req, res){
    const {id} = req.params;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", "");

    try {
        const result = await connection.query(`
            SELECT * FROM sessions WHERE token = $1;
        `, [token]);
        const userId = result.rows[0].userId;

        if(result.rowCount === 0){
            return res.sendStatus(401);
        }

        const existentUrlFromUser = await connection.query(`
            SELECT * FROM urls 
            WHERE "userId"= $1 AND id=$2;
        `, [userId, id]);
        if(existentUrlFromUser.rowCount === 0){
            return res.sendStatus(401);
        }

        await connection.query(`
            DELETE FROM urls WHERE id=$1;
        `, [id]);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}