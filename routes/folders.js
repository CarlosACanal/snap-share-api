const express = require('express');
const db = require('../db/database');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: Rotas para pastas
 */

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Criar uma nova pasta
 *     tags: [Folders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pasta de Verão"
 *               photographer_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Pasta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar pasta
 */
router.post('/', (req, res) => {
    const { name, photographer_id } = req.body;
    db.run(`INSERT INTO Folders (name, photographer_id) VALUES (?, ?)`,
        [name, photographer_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
});

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: Obter todas as pastas
 *     tags: [Folders]
 *     responses:
 *       200:
 *         description: Lista de pastas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   photographer_id:
 *                     type: integer
 *       500:
 *         description: Erro ao obter pastas
 */
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Folders`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * @swagger
 * /folders/{id}:
 *   get:
 *     summary: Obter uma pasta por ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pasta
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pasta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 photographer_id:
 *                   type: integer
 *       404:
 *         description: Pasta não encontrada
 *       500:
 *         description: Erro ao obter pasta
 */
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM Folders WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Folder not found' });
        res.json(row);
    });
});

/**
 * @swagger
 * /folders/{id}:
 *   put:
 *     summary: Atualizar uma pasta por ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pasta
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pasta de Inverno"
 *               photographer_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Pasta atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Pasta não encontrada
 *       500:
 *         description: Erro ao atualizar pasta
 */
router.put('/:id', (req, res) => {
    const { name, photographer_id } = req.body;
    db.run(`UPDATE Folders SET name = ?, photographer_id = ? WHERE id = ?`,
        [name, photographer_id, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Folder not found' });
            res.json({ updated: this.changes });
        });
});

/**
 * @swagger
 * /folders/{id}:
 *   delete:
 *     summary: Excluir uma pasta por ID
 *     tags: [Folders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da pasta
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pasta excluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Pasta não encontrada
 *       500:
 *         description: Erro ao excluir pasta
 */
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM Folders WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Folder not found' });
        res.json({ deleted: this.changes });
    });
});

/**
 * @swagger
 * /folders/{photographer_id}/folders:
 *   get:
 *     summary: Buscar todas as pastas de um fotógrafo
 *     description: Retorna todas as pastas que pertencem ao fotógrafo com o ID especificado.
 *     parameters:
 *       - in: path
 *         name: photographer_id
 *         required: true
 *         description: ID do fotógrafo.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de pastas do fotógrafo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 folders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID da pasta.
 *                       title:
 *                         type: string
 *                         description: Título da pasta.
 *                       photographer_id:
 *                         type: integer
 *                         description: ID do fotógrafo.
 *       '404':
 *         description: Fotógrafo não encontrado ou sem pastas.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/:photographer_id/folders', (req, res) => {
    const photographer_id = req.params.photographer_id;

    const query = 'SELECT * FROM folders WHERE photographer_id = ?';
    db.all(query, [photographer_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Álbum não encontrado.' });
        }
        return res.json(rows);
    });
});

/**
 * @swagger
 * /folders/{folderId}/albums:
 *   get:
 *     summary: Buscar todos os álbuns de uma pasta
 *     description: Retorna todos os álbuns que pertencem à pasta com o ID especificado.
 *     parameters:
 *       - in: path
 *         name: folderId
 *         required: true
 *         description: ID da pasta.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de álbuns da pasta.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do álbum.
 *                   access_hash:
 *                     type: string
 *                     description: Hash de acesso do álbum.
 *                   download_count:
 *                     type: integer
 *                     description: Contagem de downloads do álbum.
 *                   download_limit:
 *                     type: integer
 *                     description: Limite de downloads do álbum.
 *                   folder_id:
 *                     type: integer
 *                     description: ID da pasta à qual o álbum pertence.
 *       '404':
 *         description: Pasta não encontrada ou sem álbuns.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.get('/:folderId/albums', (req, res) => {
    const { folderId } = req.params;

    const query = 'SELECT id, access_hash, download_count, download_limit, folder_id FROM albums WHERE folder_id = ?';
    db.all(query, [folderId], (err, albums) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (albums.length === 0) {
            return res.status(404).json({ message: 'Pasta não encontrada ou sem álbuns.' });
        }

        // Retorna a lista de álbuns diretamente
        return res.json(albums);
    });
});

module.exports = router;