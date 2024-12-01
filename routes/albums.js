const express = require("express");
const db = require("../db/database");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Rotas para álbuns
 */

/**
 * @swagger
 * /albums:
 *   post:
 *     summary: Criar um novo álbum
 *     tags: [Albums]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               download_count:
 *                 type: integer
 *                 example: 0
 *               download_limit:
 *                 type: integer
 *                 example: 100
 *               folder_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "ensaio x"
 *     responses:
 *       201:
 *         description: Álbum criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar álbum
 */
router.post("/", (req, res) => {
  const { download_count, download_limit, folder_id, name } = req.body;

  // Gerar um access_hash aleatório de 6 dígitos
  const access_hash = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um número entre 100000 e 999999
  
  db.run(
    `INSERT INTO Albums (access_hash, download_count, download_limit, folder_id, name) VALUES (?, ?, ?, ?, ?)`,
    [access_hash, download_count, download_limit, folder_id, name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

/**
 * @swagger
 * /albums:
 *   get:
 *     summary: Obter todos os álbuns
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: Lista de álbuns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   access_hash:
 *                     type: string
 *                   download_count:
 *                     type: integer
 *                   download_limit:
 *                     type: integer
 *                   folder_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Erro ao obter álbuns
 */
router.get("/", (req, res) => {
  db.all(`SELECT * FROM Albums`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * @swagger
 * /albums/{id}:
 *   get:
 *     summary: Obter um álbum por ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Álbum encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 access_hash:
 *                   type: string
 *                 download_count:
 *                   type: integer
 *                 download_limit:
 *                   type: integer
 *                 folder_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Álbum não encontrado
 *       500:
 *         description: Erro ao obter álbum
 */
router.get("/:id", (req, res) => {
  db.get(`SELECT * FROM Albums WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Album not found" });
    res.json(row);
  });
});

/**
 * @swagger
 * /albums/{id}:
 *   put:
 *     summary: Atualizar um álbum por ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_hash:
 *                 type: string
 *                 example: "abc123"
 *               download_count:
 *                 type: integer
 *                 example: 10
 *               download_limit:
 *                 type: integer
 *                 example: 100
 *               folder_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "ensaio x"
 *     responses:
 *       200:
 *         description: Álbum atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Álbum não encontrado
 *       500:
 *         description: Erro ao atualizar álbum
 */
router.put("/:id", (req, res) => {
  const { access_hash, download_count, download_limit, folder_id, name } =
    req.body;
  db.run(
    `UPDATE Albums SET access_hash = ?, download_count = ?, download_limit = ?, folder_id = ?, name = ? WHERE id = ?`,
    [
      access_hash,
      download_count,
      download_limit,
      folder_id,
      name,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ message: "Album not found" });
      res.json({ updated: this.changes });
    }
  );
});

/**
 * @swagger
 * /albums/{id}:
 *   delete:
 *     summary: Excluir um álbum por ID
 *     tags: [Albums]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do álbum
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Álbum excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Álbum não encontrado
 *       500:
 *         description: Erro ao excluir álbum
 */
router.delete("/:id", (req, res) => {
  db.run(`DELETE FROM Albums WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Album not found" });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
