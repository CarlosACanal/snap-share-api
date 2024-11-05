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

module.exports = router;