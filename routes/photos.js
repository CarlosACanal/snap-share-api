const express = require('express');
const db = require('../db/database');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: Rotas para fotos
 */

/**
 * @swagger
 * /photos:
 *   post:
 *     summary: Criar uma nova foto
 *     tags: [Photos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example.com/photo.jpg"
 *               album_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Foto criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar foto
 */
router.post('/', (req, res) => {
    const { url, album_id } = req.body;
    db.run(`INSERT INTO Photos (url, album_id) VALUES (?, ?)`,
        [url, album_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
});

/**
 * @swagger
 * /photos:
 *   get:
 *     summary: Obter todas as fotos
 *     tags: [Photos]
 *     responses:
 *       200:
 *         description: Lista de fotos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   url:
 *                     type: string
 *                   album_id:
 *                     type: integer
 *       500:
 *         description: Erro ao obter fotos
 */
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Photos`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * @swagger
 * /photos/{id}:
 *   get:
 *     summary: Obter uma foto por ID
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da foto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foto encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 url:
 *                   type: string
 *                 album_id:
 *                   type: integer
 *       404:
 *         description: Foto não encontrada
 *       500:
 *         description: Erro ao obter foto
 */
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM Photos WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Photo not found' });
        res.json(row);
    });
});

/**
 * @swagger
 * /photos/{id}:
 *   put:
 *     summary: Atualizar uma foto por ID
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da foto
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example.com/updated_photo.jpg"
 *               album_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Foto atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Foto não encontrada
 *       500:
 *         description: Erro ao atualizar foto
 */
router.put('/:id', (req, res) => {
    const { url, album_id } = req.body;
    db.run(`UPDATE Photos SET url = ?, album_id = ? WHERE id = ?`,
        [url, album_id, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Photo not found' });
            res.json({ updated: this.changes });
        });
});

/**
 * @swagger
 * /photos/{id}:
 *   delete:
 *     summary: Excluir uma foto por ID
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da foto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Foto excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Foto não encontrada
 *       500:
 *         description: Erro ao excluir foto
 */
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM Photos WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Photo not found' });
        res.json({ deleted: this.changes });
    });
});

/**
 * @swagger
 * /photos/{album_id}/photos:
 *   get:
 *     summary: Obter todas as fotos de um álbum específico
 *     description: Retorna uma lista de fotos associadas ao álbum especificado pelo ID.
 *     parameters:
 *       - name: album_id
 *         in: path
 *         required: true
 *         description: ID do álbum para o qual as fotos devem ser recuperadas.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de fotos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da foto.
 *                   album_id:
 *                     type: integer
 *                     description: ID do álbum ao qual a foto pertence.
 *                   title:
 *                     type: string
 *                     description: Título da foto.
 *                   url:
 *                     type: string
 *                     description: URL da foto.
 *       '404':
 *         description: Álbum não encontrado.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/:album_id/photos', (req, res) => {
    const albumId = req.params.album_id;

    const query = 'SELECT * FROM photos WHERE album_id = ?';
    db.all(query, [albumId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Álbum não encontrado.' });
        }
        return res.json(rows);
    });
});

module.exports = router;

module.exports = router;



