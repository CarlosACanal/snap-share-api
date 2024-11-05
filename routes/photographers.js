const express = require('express');
const db = require('../db/database');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Photographers
 *   description: Rotas para fotógrafos
 */

/**
 * @swagger
 * /photographers:
 *   post:
 *     summary: Criar um novo fotógrafo
 *     tags: [Photographers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao.silvaexample.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *               document:
 *                 type: string
 *                 example: "123456789"
 *               company_name:
 *                 type: string
 *                 example: "Fotografia Silva"
 *               logo:
 *                 type: string
 *                 example: "logo.png"
 *               description:
 *                 type: string
 *                 example: "Fotógrafo especializado em casamentos."
 *     responses:
 *       201:
 *         description: Fotógrafo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar fotógrafo
 */
router.post('/', (req, res) => {
    const { name, email, password, document, company_name, logo, description } = req.body;
    db.run(`INSERT INTO Photographers (name, email, password, document, company_name, logo, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, password, document, company_name, logo, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        });
});

/**
 * @swagger
 * /photographers/login:
 *   post:
 *     summary: Login de fotógrafos
 *     description: Realiza o login de um fotógrafo e retorna uma mensagem de sucesso ou erro.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do fotógrafo.
 *               password:
 *                 type: string
 *                 description: Senha do fotógrafo.
 *     responses:
 *       '200':
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso.
 *       '401':
 *         description: Credenciais inválidas.
 *       '500':
 *         description: Erro interno do servidor.
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM photographers WHERE email = ?';
    db.get(query, [email], (err, photographer) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!photographer) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Verifica a senha (sem hash)
        if (photographer.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Se as credenciais estiverem corretas, retorna os dados do fotógrafo
        const { id, name, email: photographerEmail } = photographer;
        return res.json({
            message: 'Login bem-sucedido.',
            photographer: {
                id,
                name,
                email: photographerEmail,
            },
        });
    });
});

/**
 * @swagger
 * /photographers:
 *   get:
 *     summary: Obter todos os fotógrafos
 *     tags: [Photographers]
 *     responses:
 *       200:
 *         description: Lista de fotógrafos
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
 *                   email:
 *                     type: string
 *                   document:
 *                     type: string
 *                   company_name:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Erro ao obter fotógrafos
 */
router.get('/', (req, res) => {
    db.all(`SELECT * FROM Photographers`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * @swagger
 * /photographers/{id}:
 *   get:
 *     summary: Obter um fotógrafo por ID
 *     tags: [Photographers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do fotógrafo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fotógrafo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 document:
 *                   type: string
 *                 company_name:
 *                   type: string
 *                 logo:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Fotógrafo não encontrado
 *       500:
 *         description: Erro ao obter fotógrafo
 */
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM Photographers WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Photographer not found' });
        res.json(row);
    });
});

/**
 * @swagger
 * /photographers/{id}:
 *   put:
 *     summary: Atualizar um fotógrafo por ID
 *     tags: [Photographers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do fotógrafo
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
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao.silva@example.com"
 *               password:
 *                 type: string
 *                 example: "nova_senha123"
 *               document:
 *                 type: string
 *                 example: "123456789"
 *               company_name:
 *                 type: string
 *                 example: "Fotografia Silva"
 *               logo:
 *                 type: string
 *                 example: "novo_logo.png"
 *               description:
 *                 type: string
 *                 example: "Fotógrafo especializado em retratos."
 *     responses:
 *       200:
 *         description: Fotógrafo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Fotógrafo não encontrado
 *       500:
 *         description: Erro ao atualizar fotógrafo
 */
router.put('/:id', (req, res) => {
    const { name, email, password, document, company_name, logo, description } = req.body;
    db.run(`UPDATE Photographers SET name = ?, email = ?, password = ?, document = ?, company_name = ?, logo = ?, description = ? WHERE id = ?`,
        [name, email, password, document, company_name, logo, description, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Photographer not found' });
            res.json({ updated: this.changes });
        });
});

/**
 * @swagger
 * /photographers/{id}:
 *   delete:
 *     summary: Excluir um fotógrafo por ID
 *     tags: [Photographers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do fotógrafo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fotógrafo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Fotógrafo não encontrado
 *       500:
 *         description: Erro ao excluir fotógrafo
 */
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM Photographers WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Photographer not found' });
        res.json({ deleted: this.changes });
    });
});

module.exports = router;